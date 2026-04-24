-- ==========================================================
-- Clippr database schema
-- Run this once in Supabase: SQL Editor -> New query -> paste
-- -> Run. Safe to re-run; uses IF NOT EXISTS / CREATE OR REPLACE.
-- ==========================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ==========================================================
-- profiles -- one row per auth user
-- ==========================================================
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        text unique,                 -- e.g. @arjunclips
  display_name  text,
  country       text,
  payout_method text check (payout_method in ('paypal','bank')),
  paypal_email  text,
  bank_details  jsonb,
  is_admin      boolean default false,
  created_at    timestamptz default now()
);

-- ==========================================================
-- campaigns
-- ==========================================================
create table if not exists campaigns (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique,
  name              text not null,
  tag               text,
  description       text,
  brief_md          text,
  rpm               numeric(6,2) not null default 1.00,
  min_views         integer default 1000,
  payout_floor      numeric(6,2) default 20,
  monthly_budget    numeric(12,2) default 25000,
  budget_remaining  numeric(12,2) default 25000,
  status            text check (status in ('draft','live','paused','ended')) default 'draft',
  tint              text default '#6366f1',
  examples          jsonb default '[]'::jsonb,   -- [{handle,views,hook,url}]
  assets            jsonb default '[]'::jsonb,   -- [{label,sub,url,kind}]
  dos               jsonb default '[]'::jsonb,
  donts             jsonb default '[]'::jsonb,
  discord_url       text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ==========================================================
-- clips
-- ==========================================================
create table if not exists clips (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  campaign_id       uuid not null references campaigns(id) on delete cascade,
  url               text not null,
  platform          text check (platform in ('tiktok','instagram','youtube','other')),
  notes             text,
  status            text check (status in ('pending','approved','rejected')) default 'pending',
  views             integer default 0,                 -- latest known view count
  earned            numeric(10,2) default 0,           -- computed: see recompute_clip_earned()
  rejection_reason  text,
  submitted_at      timestamptz default now(),
  reviewed_at       timestamptz,
  reviewed_by       uuid references auth.users(id)
);

create index if not exists clips_user_idx on clips(user_id);
create index if not exists clips_campaign_idx on clips(campaign_id);
create index if not exists clips_status_idx on clips(status);

-- ==========================================================
-- payouts
-- ==========================================================
create table if not exists payouts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  amount        numeric(10,2) not null,
  method        text check (method in ('paypal','bank')),
  destination   text,
  status        text check (status in ('pending','processing','paid','failed')) default 'pending',
  txn_ref       text,
  notes         text,
  requested_at  timestamptz default now(),
  paid_at       timestamptz,
  paid_by       uuid references auth.users(id)
);

create index if not exists payouts_user_idx on payouts(user_id);
create index if not exists payouts_status_idx on payouts(status);

-- ==========================================================
-- Earnings recompute helper
-- A clip earns: (views * rpm/1000) once approved AND views >= campaign.min_views.
-- Called from app code after admin updates view counts or status.
-- ==========================================================
create or replace function recompute_clip_earned(clip_id uuid) returns void as $$
declare
  c clips;
  cmp campaigns;
begin
  select * into c from clips where id = clip_id;
  if not found then return; end if;
  select * into cmp from campaigns where id = c.campaign_id;
  if not found then return; end if;

  if c.status = 'approved' and c.views >= cmp.min_views then
    update clips set earned = round((c.views::numeric * cmp.rpm / 1000.0)::numeric, 2) where id = clip_id;
  else
    update clips set earned = 0 where id = clip_id;
  end if;
end;
$$ language plpgsql security definer;

-- ==========================================================
-- View: clipper balance (sum of earnings minus paid/pending payouts)
-- ==========================================================
create or replace view clipper_balances as
select
  u.id as user_id,
  coalesce(c.total_earned, 0)        as total_earned,
  coalesce(p.total_pending_paid, 0)  as total_pending_paid,
  greatest(coalesce(c.total_earned, 0) - coalesce(p.total_pending_paid, 0), 0) as available_balance
from auth.users u
left join (
  select user_id, sum(earned) as total_earned
  from clips
  where status = 'approved'
  group by user_id
) c on c.user_id = u.id
left join (
  select user_id, sum(amount) as total_pending_paid
  from payouts
  where status in ('pending','processing','paid')
  group by user_id
) p on p.user_id = u.id;

-- ==========================================================
-- Row Level Security
-- ==========================================================
alter table profiles  enable row level security;
alter table campaigns enable row level security;
alter table clips     enable row level security;
alter table payouts   enable row level security;

-- ----- profiles -----
drop policy if exists "profiles self read" on profiles;
create policy "profiles self read"  on profiles for select using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "profiles self upsert" on profiles;
create policy "profiles self upsert" on profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles self update" on profiles;
create policy "profiles self update" on profiles for update using (auth.uid() = id);

drop policy if exists "profiles admin update" on profiles;
create policy "profiles admin update" on profiles for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ----- campaigns -----
drop policy if exists "campaigns public read live" on campaigns;
create policy "campaigns public read live" on campaigns for select using (status = 'live' or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "campaigns admin write" on campaigns;
create policy "campaigns admin write" on campaigns for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ----- clips -----
drop policy if exists "clips self read" on clips;
create policy "clips self read" on clips for select using (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "clips self insert" on clips;
create policy "clips self insert" on clips for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "clips admin update" on clips;
create policy "clips admin update" on clips for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "clips self delete pending" on clips;
create policy "clips self delete pending" on clips for delete using (auth.uid() = user_id and status = 'pending');

-- ----- payouts -----
drop policy if exists "payouts self read" on payouts;
create policy "payouts self read" on payouts for select using (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

drop policy if exists "payouts self insert" on payouts;
create policy "payouts self insert" on payouts for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "payouts admin update" on payouts;
create policy "payouts admin update" on payouts for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ==========================================================
-- Auto-create profile row on signup
-- ==========================================================
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ==========================================================
-- Seed: Rizz campaign (so the marketing page has something LIVE)
-- ==========================================================
insert into campaigns (slug, name, tag, description, brief_md, rpm, min_views, payout_floor, monthly_budget, budget_remaining, status, tint, examples, dos, donts)
values (
  'rizz',
  'Rizz — AI dating replies',
  'Dating · Lifestyle',
  'Short-form clips showing the Rizz AI app generating smooth replies for dating chats.',
  'Hook within 1.5s. Use the "POV: texting back" format. Show the Rizz app screen recording. End with the tracked download CTA.',
  1.00, 1000, 20, 25000, 24000, 'live', '#6366f1',
  '[
    {"handle":"@rizz.clips.daily","views":"1.2M","hook":"POV: texting back like THIS","grad":"linear-gradient(160deg,#6366f1,#0a0a0a 70%)"},
    {"handle":"@rizzdaily.gen","views":"842K","hook":"Use this reply for cold openers","grad":"linear-gradient(160deg,#3b82f6,#0a0a0a 70%)"},
    {"handle":"@text.tactics","views":"612K","hook":"She left me on read. Comeback","grad":"linear-gradient(160deg,#10b981,#0a0a0a 70%)"},
    {"handle":"@gametips.daily","views":"480K","hook":"Stop saying hey. Try this","grad":"linear-gradient(160deg,#f59e0b,#0a0a0a 70%)"}
  ]'::jsonb,
  '[
    "Hook in the first 1.5 seconds — text-on-screen with the POV format",
    "Show a real screenshot/screen recording of the Rizz app generating the reply",
    "End with the tracked download link in your bio + caption",
    "Use the trending sound from the Sounds section",
    "Vertical 9:16, 1080p, length 15-28s"
  ]'::jsonb,
  '[
    "No watermarks from CapCut, TikTok save, or other clipping programs",
    "No reposting other clippers exact videos — flagged as duplicate",
    "No NSFW, slurs, or content that breaks community guidelines",
    "Don''t crop the app screen recording out — viewers need to see Rizz working",
    "Don''t post the same clip to more than 2 of your accounts"
  ]'::jsonb
)
on conflict (slug) do nothing;
