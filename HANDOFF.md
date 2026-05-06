# Cliprr — Engineering Handoff

> Status as of this commit. Live, partially working. Specific bugs and next-step items called out below.

---

## 1. Product

**Cliprr** is a clipping-program platform. The owner (Kevis) hires video editors — primarily from developing countries (India, Philippines, Nigeria, Pakistan, Egypt, etc.) — to repost short-form clips of his apps to TikTok, Instagram Reels, and YouTube Shorts. He pays editors per 1,000 views, weekly via PayPal/bank transfer, manually.

Two campaigns are planned:
- **Rizz** (live) — AI-generated dating-chat replies. Format: iMessage-style overlay on top of high-retention B-roll (Minecraft parkour, GTA, basketball), with a screen-recording reveal of the Rizz app generating the reply.
- **Campaign #2** (TBA — second app, not yet launched).

Three surfaces:
- **Marketing site** (logged out) — pitches editors to apply
- **Clipper dashboard** (logged in, default) — campaigns, submit clip, payouts, settings
- **Admin dashboard** (logged in, `is_admin = true`) — review queue, campaign CRUD, payout processing

The pitch to editors leans hard on trust signals (real founder, real recent payouts, low-friction onboarding) and a "Day 1 monetization" framing — they get paid before YouTube/TikTok native monetization would kick in.

---

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 via Babel-in-browser, vanilla JSX files served as static assets | No build step needed for MVP; simple to iterate. **Should migrate to Vite before scale** (slow first paint; no tree-shaking). |
| Backend | Supabase (managed Postgres + Auth + RLS) | Free tier, replaces ~1000 LOC of Node/Express we'd otherwise write. Browser talks to Supabase directly via `@supabase/supabase-js@2`. |
| Hosting | DigitalOcean App Platform (Static Site) | One file: `.do/app.yaml`. Auto-deploys on push to `main`. |
| Repo | github.com/keviscoding/clippr | Public. Owner: keviscoding. |
| Domain | cliprr.io (Namecheap → DO nameservers, in progress) | DNS migration paused mid-config. |

### Critical architectural notes

- **No backend code lives in this repo.** All data access is browser → Supabase via the JS SDK. RLS policies are the security boundary.
- **The Supabase anon key is public-safe** — it's committed to `project/src/config.js`. RLS protects data, not the key.
- **View counts are entered manually** by the admin during clip review. Auto-scraping TikTok/IG/YT view counts is a fragile separate project; manual entry is industry standard at this stage.
- **Payouts are processed manually.** The admin sends PayPal/bank transfer outside the app, then marks the payout row as `paid` with the txn ref. The app tracks state, not money movement.

---

## 3. Repo structure

```
.
├── .do/
│   └── app.yaml                         # DO App Platform spec (static site, source_dir: /project)
├── supabase/
│   └── schema.sql                       # ENTIRE database schema. Idempotent — safe to re-run.
├── project/                             # ← static site root (DO serves this)
│   ├── index.html                       # App shell + auth bootstrap + role routing
│   ├── colors_and_type.css              # Geist + Geist Mono fonts
│   ├── rizz-guide.html                  # Standalone "Creator Network" full editor onboarding doc
│   ├── assets/                          # (placeholder for raw footage / assets — currently empty)
│   ├── fonts/                           # Geist font files
│   └── src/
│       ├── config.js                    # SUPABASE_URL + SUPABASE_ANON_KEY (public-safe)
│       ├── api.jsx                      # window.api — entire data access layer
│       ├── shared.jsx                   # window: LogoMark, Wordmark, Icon, Button, Badge, Eyebrow, etc.
│       ├── SurfaceDock.jsx              # Admin-only top dock to preview marketing/clipper surfaces
│       ├── marketing/
│       │   ├── Nav.jsx
│       │   ├── Hero.jsx                 # Includes inline SVG "Minecraft" sky for the phone preview
│       │   ├── PayoutTicker.jsx         # Pulls real recent paid payouts; falls back to placeholder
│       │   ├── HowItWorks.jsx
│       │   ├── CampaignGrid.jsx         # Pulls live campaigns from Supabase; falls back to seed
│       │   ├── FounderVideo.jsx         # Placeholder play-button div — replace with real <iframe> later
│       │   ├── ProofSection.jsx         # Hardcoded testimonials (replace once real ones exist)
│       │   ├── Faq.jsx                  # Accordion, 10 Q&As
│       │   ├── CtaFooter.jsx
│       │   └── AuthModal.jsx            # Real signup/login → window.api.signUp / signIn
│       ├── clipper/
│       │   ├── Sidebar.jsx              # Nav + available balance + sign-out (incl. Topbar export)
│       │   ├── EarningsOverview.jsx     # KPIs, chart, recent clips table
│       │   ├── CampaignsList.jsx        # Cards per live campaign with per-clipper stats
│       │   ├── BriefDetail.jsx          # Full brief page; YouTube + Instagram carousel; admin info bar
│       │   ├── SubmitClipModal.jsx      # Inserts row into clips with status='pending'
│       │   ├── PayoutsPanel.jsx         # Request payout + history
│       │   └── SettingsPanel.jsx        # Profile + payout method (PayPal or Bank)  ← BUG, see §6
│       └── admin/
│           ├── AdminSidebar.jsx
│           ├── AdminOverview.jsx        # Top-level KPIs from getAdminStats
│           ├── ReviewQueue.jsx          # Approve/reject; admin enters view count → earnings recompute
│           ├── CampaignEditor.jsx       # Full CRUD; row-based ExamplesEditor with YT + IG support
│           └── PayoutsAdmin.jsx         # Mark payouts paid/processing/failed
├── SETUP.md                             # User-facing setup walkthrough (Supabase project creation)
└── HANDOFF.md                           # ← this document
```

---

## 4. Database schema (Supabase / Postgres)

Full SQL in `supabase/schema.sql`. Idempotent — uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS`. Re-running is safe.

### Tables

#### `profiles` — extends `auth.users`
- `id` uuid, PK, FK → `auth.users(id)` cascade
- `handle` text, unique (e.g. `@arjun`)
- `display_name` text
- `country` text
- `payout_method` text check `('paypal','bank')`
- `paypal_email` text
- `bank_details` jsonb — `{account_holder, iban, swift, summary}`
- `is_admin` boolean default false
- `created_at` timestamptz

#### `campaigns`
- `id` uuid PK
- `slug` text unique (e.g. `rizz`)
- `name`, `tag`, `description`, `brief_md` text
- `rpm` numeric (default 1.00)
- `min_views` int (default 1000)
- `payout_floor` numeric (default 20)
- `monthly_budget`, `budget_remaining` numeric
- `status` text check `('draft','live','paused','ended')`
- `tint` text (hex color)
- `examples` jsonb — array of `{url, hook, handle, views, grad?}`
  - `url` can be YouTube, YouTube Shorts, or Instagram Reel — UI auto-detects
- `assets` jsonb — array of `{label, sub, url, kind, cta}`
- `dos`, `donts` jsonb — arrays of strings
- `discord_url` text

#### `clips`
- `id` uuid PK
- `user_id` uuid FK → `auth.users(id)` cascade
- `campaign_id` uuid FK → `campaigns(id)` cascade
- `url` text — TikTok / Reels / Shorts URL
- `platform` text check `('tiktok','instagram','youtube','other')` — auto-detected from URL
- `notes` text — clipper's optional note to reviewer
- `status` text check `('pending','approved','rejected')` default pending
- `views` int — admin-entered, fed back from platform analytics
- `earned` numeric — computed via `recompute_clip_earned(clip_id)` RPC
- `rejection_reason` text
- `submitted_at`, `reviewed_at` timestamptz
- `reviewed_by` uuid

#### `payouts`
- `id` uuid PK
- `user_id` uuid FK → `auth.users(id)`
- `amount` numeric
- `method` text check `('paypal','bank')`
- `destination` text — paypal email or bank summary
- `status` text check `('pending','processing','paid','failed')`
- `txn_ref`, `notes` text
- `requested_at`, `paid_at` timestamptz
- `paid_by` uuid

### View

#### `clipper_balances`
For each `auth.users` row, returns:
- `total_earned` (sum of `clips.earned` where status=approved)
- `total_pending_paid` (sum of `payouts.amount` where status in pending/processing/paid)
- `available_balance` = max(total_earned − total_pending_paid, 0)

### Functions

- `is_current_user_admin()` — `security definer`, returns `coalesce((select is_admin from profiles where id = auth.uid()), false)`. Used in RLS policies to avoid recursion (see §6 known issues — there was a bug here).
- `recompute_clip_earned(clip_id uuid)` — recalculates `clips.earned` based on `views >= campaign.min_views` AND `status = 'approved'`. Called by `api.reviewClip` after admin updates.
- `handle_new_user()` trigger — auto-creates a `profiles` row when a user signs up via `auth.users`.

### RLS — every table is locked down

Policies (all use `is_current_user_admin()` instead of inline EXISTS to prevent recursion):

- `profiles`: self read/insert/update; admin can read+update all
- `campaigns`: public read for `status='live'`, admin all
- `clips`: self read; self insert (must be `pending`); admin update; self delete (must be `pending`)
- `payouts`: self read; self insert (must be `pending`); admin update

### Seed data
The schema seeds **one campaign**: Rizz, status=live, RPM=$1.00, with examples + dos + donts populated.

---

## 5. The API layer (`project/src/api.jsx`)

Single IIFE that exposes everything as `window.api`. Every function returns `{data, error}` and never throws.

Key functions:

```
auth:
  signUp({email, password, displayName})
  signIn({email, password})
  signOut()
  getSession()
  onAuthStateChange(cb)              // returns unsubscribe

profile:
  getMyProfile()
  updateMyProfile(patch)             // ← involved in the SettingsPanel bug

campaigns:
  listLiveCampaigns()
  listAllCampaigns()
  getCampaignBySlug(slug)
  getCampaign(id)
  upsertCampaign(c)                  // admin only via RLS
  getCampaignStats(campaignId)       // {clipperCount, totalClips, totalViews, totalEarned}

clips:
  submitClip({campaignId, url, notes, platform})
  listMyClips()
  listPendingClips()                 // admin
  listAllClips()                     // admin
  reviewClip(id, {status, views, rejection_reason})  // calls recompute_clip_earned RPC
  updateClipViews(id, views)

balance:
  getMyBalance()                     // reads from clipper_balances view

payouts:
  requestPayout({amount, method, destination})
  listMyPayouts()
  listAllPayouts()                   // admin
  listPendingPayouts()               // admin
  listRecentPaidPayouts(limit)       // public, used in marketing ticker
  processPayout(id, {status, txn_ref, notes})  // admin

admin:
  getAdminStats()                    // {pendingClipsCount, pendingPayoutsCount, pendingPayoutAmount,
                                     //  totalViews, totalPaid, totalClippers}

helpers (sync, no network):
  detectPlatform(url)
  youtubeId(url) / isYoutubeShorts(url) / youtubeThumb(id) / youtubeEmbed(id)
  instagramShortcode(url) / isInstagram(url) / isInstagramReel(url) / instagramEmbed(shortcode)
  videoKindFromUrl(url)              // returns 'yt' | 'yt-shorts' | 'ig' | 'ig-reel' | 'other'

attachProfiles(rows, fields)         // internal — joins profiles to clips/payouts client-side
                                     // (PostgREST can't join FK to auth.users; see §6)
```

---

## 6. Known issues / open bugs

### **A. Settings save hangs (CURRENTLY REPORTED)**

**Symptom:** A clipper fills in country / payout method / bank details / etc. in `SettingsPanel.jsx` → clicks **Save** → button stays in `Saving…` indefinitely. Data not persisted.

**Where the call lives:**
- `project/src/clipper/SettingsPanel.jsx` → `save()` calls `api.updateMyProfile(patch)`
- `project/src/api.jsx` → `updateMyProfile(patch)` → `client.from("profiles").update(patch).eq("id", user.id).select().maybeSingle()`

**Hypotheses (in order of likelihood):**
1. The `client.auth.getUser()` call inside `updateMyProfile()` hangs because the user's session token expired and the silent refresh is failing. The await never resolves → `setBusy(false)` never fires.
2. RLS allows the UPDATE, but `.select().maybeSingle()` returns `{data: null, error: null}` because somehow the row isn't being read back. This wouldn't cause hanging though — it'd return successfully with null data.
3. Network failure being silently retried. supabase-js v2 has built-in retries but they're bounded.

**Recommended fix:**
- Add an explicit timeout wrapper around `updateMyProfile`: `Promise.race([updateMyProfile(...), new Promise((_,r) => setTimeout(() => r(new Error('timed out')), 12000))])` so the button always exits the loading state.
- Also wrap with try/catch — currently any thrown error from the supabase client is uncaught.
- Show the actual error in the UI, not just a generic message.
- Add a console.log of the patch payload before sending, to verify the form data structure.
- Test with both PayPal and Bank flows.

**Workaround for now:** SQL update directly in Supabase SQL Editor:
```sql
update profiles set
  display_name='', country='', payout_method='bank',
  bank_details = jsonb_build_object('account_holder','...','iban','...','swift','...','summary','...')
where id = (select id from auth.users where email = 'user@example.com');
```

### **B. Supabase Site URL is wrong**

Auth Site URL in Supabase is set to `localhost:3000` (default). Email confirmation, password reset, magic-link emails all go to localhost.

**Fix:** Supabase → Authentication → URL Configuration → set **Site URL** to live URL (`https://cliprr.io` or DO ondigitalocean.app URL). Add same URL to Redirect URLs allow list.

### **C. No password-reset UI**

App has no "Forgot password?" link, and no `/reset-password` route to handle Supabase's recovery token. So even after fixing (B), reset emails arrive but link to a 404.

**Need to build:**
1. "Forgot password?" link in `AuthModal.jsx` → calls `client.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password.html' })`
2. New page `/reset-password.html` (or wire into the React app) that:
   - Reads the token from the URL hash (Supabase puts it in `#access_token=...&type=recovery`)
   - Calls `client.auth.updateUser({ password: newPwd })` to set a new password
   - Redirects back to login

### **D. RLS recursion bug — fixed but worth noting**

The original schema had `auth.uid() = id or exists (select 1 from profiles where ...)` policies. Postgres tried to evaluate the inner subquery through RLS too → infinite recursion → error 42P17. Fixed by introducing the `is_current_user_admin()` `security definer` helper. **Don't reintroduce inline EXISTS subqueries on `profiles`** — always use the helper.

### **E. Foreign keys point to auth.users, not profiles**

`clips.user_id` and `payouts.user_id` reference `auth.users(id)`, not `profiles(id)`. PostgREST can't auto-join to `profiles` from those tables. This was a real bug — the Review Queue showed "Inbox 0" because `listPendingClips` used `profiles!clips_user_id_fkey(...)` which PostgREST rejected.

**Already fixed** by adding `attachProfiles(rows, fields)` helper in `api.jsx` that does the join client-side via a second query. Used by `listPendingClips`, `listAllClips`, `listPendingPayouts`, `listAllPayouts`, `listRecentPaidPayouts`.

### **F. DigitalOcean autodetect quirk**

The first deploy attempt failed because DO's autodetect saw a `package.json` (since removed) and tried to run it as a Node web service. Static-site mode requires `environment_slug: html` in `.do/app.yaml`. Currently configured correctly. If a future change reintroduces `package.json`, ensure `app.yaml` still pins `static_sites` with `environment_slug: html`.

### **G. Email rate limit**

Supabase free tier caps recovery/confirmation emails to ~2/hour. Easy to hit during testing. **Mitigation:** turn off email confirmation in Supabase → Authentication → Providers → Email until production.

### **H. Babel-in-browser performance**

First paint takes 2–3s as Babel transpiles JSX in the browser. Acceptable for MVP, **must replace before scale.** Migration path: Vite + a build step + DO buildpack. Also enables proper imports/exports instead of `window.X = X` globals.

---

## 7. What's implemented

### Marketing site (logged out)
- ✅ Nav, Hero (with Minecraft-style SVG phone preview), payout ticker (real data when available), 3-step "How it works", live campaigns grid, founder bio + testimonials, FAQ accordion (10 Q&As), CTA footer
- ✅ Auth modal — real signup + login via Supabase
- ✅ Mobile responsive (`@media (max-width: 760px)` overrides in `index.html`)
- ⚠️ Founder video block is a placeholder — needs real Loom/YouTube embed
- ⚠️ Testimonials are hardcoded — replace once real clippers exist

### Clipper dashboard
- ✅ Sidebar with available balance, sign-out, hamburger-style horizontal scroll on mobile
- ✅ Overview: real KPIs (lifetime earnings, views, approved clips, available balance), chart, recent clips table
- ✅ Campaigns: real campaigns from DB with per-clipper stats per campaign
- ✅ Brief detail page: campaign info, what to make, examples carousel (YT + IG), assets, do/don't, payment math, sticky sidebar with progress
- ✅ "Read full guide" CTA on Rizz brief → opens `/rizz-guide.html`
- ✅ Submit clip modal: inserts to DB, auto-detects platform, shows pending status
- ✅ Payouts: request payout (gated on $20 floor + payout method set), full history table
- ⚠️ Settings: form is built but **save hangs** (see §6.A)

### Admin dashboard
- ✅ Sidebar with pending counts, sign-out
- ✅ Overview: real KPIs (total paid, views, clippers, pending review/payout counts)
- ✅ Review Queue: per-clip rows with view-count input, Approve/Reject. Earnings auto-recompute on approve.
- ✅ Campaign editor: full CRUD (basics, economics, content). **Row-based ExamplesEditor** with YouTube + Instagram URL detection and live thumbnail preview.
- ✅ Payouts admin: pending/all tabs, mark paid with txn ref, mark processing/failed
- ✅ "PREVIEW" surface dock at top — admin can flip into clipper/marketing views
- ✅ Per-campaign admin stats panel on Brief detail when admin views it

### Static guide page
- ✅ `/rizz-guide.html` — full Creator Network onboarding doc (the pitch, format anatomy, generator section, payout tiers per platform, rules, payouts, CTA)
- ✅ Two real Instagram example reels embedded inline (DHSd0HvJkTD, DHP-S81pGWB)
- ✅ "← Back to Cliprr" floating pill top-left
- ✅ Mobile responsive

### Infra
- ✅ Auto-deploy from `main` to DO App Platform
- ✅ `.do/app.yaml` configured for static site with `environment_slug: html`
- ✅ Supabase project: `sohhibvmcofhkwbrzhvx.supabase.co`
- ⚠️ Custom domain `cliprr.io` — DNS migration to DO nameservers in progress, not verified
- ⚠️ Supabase auth Site URL still pointing to localhost (see §6.B)

---

## 8. What's NOT yet built (roadmap)

In priority order:

1. **Fix the SettingsPanel save bug** (§6.A) — clippers literally can't set their payout method right now
2. **Build password reset flow** (§6.C) — currently no recovery path if a user forgets their password
3. **Configure Supabase Site URL** (§6.B) — quick dashboard change
4. **Email notifications** — when a clip is approved, when a payout is sent. Use Supabase database webhooks → Resend/Postmark/SendGrid. Templates needed:
   - Welcome (post-signup)
   - Clip approved
   - Clip rejected (with reason)
   - Payout sent (with txn ref)
5. **Custom domain wiring** — cliprr.io DNS to DO; configure both apex and `www`. SSL auto-provisions.
6. **Replace founder video placeholder** in `FounderVideo.jsx` with a real `<iframe>` to a 2-minute Kevis intro on Loom/YouTube.
7. **"Forgot handle / Discord username" recovery** — minor UX
8. **Build a clipper leaderboard** — top 10 by earnings/views, monthly. Display on marketing AND in Discord.
9. **Real testimonials section** — replace hardcoded ones in `ProofSection.jsx` once 3+ real clippers have payouts.
10. **Wire campaign-specific Discord URLs** — admin sets in CampaignEditor, brief page shows the link in the sidebar (currently hardcoded `#`).
11. **Migrate to Vite build pipeline** (§6.H) — production hardening.
12. **Auto-tracking of view counts** — the big one. Probably a polling job using third-party services (RapidAPI scraper for TikTok, oEmbed for YT). Not MVP-critical.
13. **Stripe Connect / PayPal Mass Pay integration** — when manual payouts become unscalable.

---

## 9. Access & credentials

- **GitHub repo:** github.com/keviscoding/clippr — owner `keviscoding`
- **Supabase project URL:** `https://sohhibvmcofhkwbrzhvx.supabase.co`
- **Supabase anon key:** committed to `project/src/config.js` (public-safe)
- **Supabase dashboard:** kevis logs in at supabase.com → Project: clippr
- **DigitalOcean App:** Apps → "clippr" — auto-deploys on push to `main`
- **Live URL:** ondigitalocean.app subdomain (currently active) + cliprr.io (DNS pending)
- **Admin user:** flip a profile to admin with:
  ```sql
  update profiles set is_admin = true
  where id = (select id from auth.users where email = 'EMAIL');
  ```

---

## 10. How to run / test locally

There's no build step. Simplest:

```bash
cd project
python3 -m http.server 8080
# open http://localhost:8080
```

The app will boot, connect to the live Supabase project (since URL/key are in `config.js`), and use real data. Treat as a separate dev environment if you want — clone the project in Supabase first.

To validate JSX without running:
```bash
cd /tmp && npm install --no-save @babel/core @babel/preset-react
node -e "
const babel=require('@babel/core'); const fs=require('fs');
[...].forEach(f => babel.transformSync(fs.readFileSync(f,'utf8'),{presets:['@babel/preset-react']}));
"
```

Babel-in-browser will catch syntax errors at runtime — open browser console.

---

## 11. Conventions / gotchas

- **All components export to `window.X`** (no ES modules — Babel-in-browser doesn't support them properly). Each file ends with `window.ComponentName = ComponentName`.
- **Hooks aliased per-file** (`useStateXY`, `useEffectXY`) to avoid duplicate `const { useState } = React;` collisions.
- **Inline styles everywhere** — there's no Tailwind or CSS-in-JS library. Mobile responsiveness is handled by adding `className` hooks on elements and matching `@media (max-width: 760px)` rules in `index.html`'s `<style>` block (using `!important` to override inline styles).
- **No emojis in code unless user explicitly asks** for them in UI copy.
- **Always pass `data` and `error` from API** — components do `if (r.error) ...` not `try/catch`. The settings bug is partly because `updateMyProfile` doesn't currently catch unhandled rejections.
- **The schema is idempotent** — re-running `supabase/schema.sql` should be safe. If you change a policy, drop+recreate it; don't ALTER.
- **RLS policies on profiles MUST go through `is_current_user_admin()`**, never inline `EXISTS (select ... from profiles)`, or you'll reintroduce the recursion bug.
- **PostgREST can't join `clips`/`payouts` to `profiles`** — use `attachProfiles()` helper.

---

## 12. Immediate next steps for the next AI

In order. Each is small enough to do in one focused pass.

1. **Fix `SettingsPanel.jsx` save** — wrap `api.updateMyProfile` with timeout + try/catch, surface the real error in `errMsg`. Verify with both PayPal and Bank flows. Test: log in as a clipper, fill the form, click Save, confirm row updates in Supabase Table Editor.
2. **Configure Supabase Site URL** in the dashboard (§6.B). One click, but blocks future fixes.
3. **Build password reset flow:**
   - Add "Forgot password?" link in `AuthModal.jsx` (login mode only)
   - On click, call `client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password.html' })`
   - Create `project/reset-password.html` standalone page (or React route) that reads `#access_token=` from URL, lets user set new password via `client.auth.updateUser({ password })`, redirects to login.
4. **Wire DNS for cliprr.io.** Owner has Namecheap. DO uses ns1/2/3.digitalocean.com. After DNS resolves, also add `https://cliprr.io` and `https://www.cliprr.io` to Supabase's allowed redirect URLs.
5. **Replace founder video placeholder** in `FounderVideo.jsx` once Kevis has the URL.
6. **Set up email notifications** — Resend has the cleanest Postgres webhook integration. Templates: signup welcome, clip approved, payout sent.

If you hit anything ambiguous, the schema in `supabase/schema.sql` is canonical and the api.jsx layer is the single source of truth for what's exposed to the frontend.

---

*Last updated alongside this commit. Owner: keviscoding.*
