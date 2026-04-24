# Clippr — setup

This is the one-time setup to turn the repo into a working app.
Total time: ~10 minutes.

## What you'll end up with

- A live Supabase Postgres database (free tier, no card required)
- The deployed Clippr site connected to it
- Real signup, login, clip submission, payouts
- You as the admin, with a separate dashboard from clippers

---

## 1. Create a Supabase project

1. Go to **https://supabase.com**, sign up (free), click **New project**
2. **Name:** `clippr` (anything)
3. **Database password:** generate + save in 1Password / Bitwarden — you may need it later
4. **Region:** pick the one closest to you and your clippers (e.g. `eu-west-2 London` for global reach, `ap-south-1 Mumbai` if most clippers are India/SE Asia)
5. Click **Create new project**. Wait ~90 seconds for it to provision.

## 2. Run the schema

1. In your project, click **SQL Editor** (left sidebar) → **New query**
2. Open `supabase/schema.sql` from this repo, copy the whole thing
3. Paste into the SQL editor → click **Run**
4. You should see **Success. No rows returned.**

This creates all the tables (`profiles`, `campaigns`, `clips`, `payouts`),
row-level security policies, and seeds one campaign (Rizz) so the marketing
page has something LIVE the moment it loads.

## 3. Connect the frontend

1. In Supabase, go to **Project Settings** (gear icon) → **API**
2. Copy two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT-style string — this one is safe to commit; data is protected by RLS)
3. Open `project/src/config.js` and paste them in:

   ```js
   window.CLIPPR_CONFIG = {
     SUPABASE_URL: "https://xxxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi...",
   };
   ```

4. Commit and push:

   ```bash
   git add project/src/config.js
   git commit -m "Wire frontend to Supabase project"
   git push
   ```

DigitalOcean autodeploys in ~90 seconds.

## 4. Make yourself an admin

1. Sign up on the live site (the URL DigitalOcean gave you, e.g. `clippr-xxxxx.ondigitalocean.app`)
2. Go back to Supabase → **SQL Editor** → **New query**
3. Run:

   ```sql
   update profiles
   set is_admin = true
   where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');
   ```

4. Sign out and sign back in — you'll now land on the **Admin dashboard**.
5. Clippers who sign up after this will go to the **Clipper dashboard** by default.

## 5. (Optional) Configure email confirmation

Supabase requires email confirmation by default. For the invite-only flow you
likely want with hand-picked editors:

- **Authentication** → **Providers** → **Email**
- Toggle **Confirm email** off if you want one-step signup
- Or leave it on and customize the email template under **Email Templates**

## 6. (Optional) Set the campaign Discord URL

In the admin dashboard:
- **Campaigns** → click **Rizz** → **Discord URL** field → paste your invite
- Save

The brief page sidebar + FAQ section will now link to it.

---

## Anything else?

- **View counts**: when a clipper submits a URL, the Review queue is where
  you paste the platform-reported view count and approve. Earnings
  recompute automatically. You can update views again later as the clip
  ages — earnings recompute each time.
- **Payouts**: clippers request from their dashboard once they're past the
  $20 cashout floor. You see the request in **Payouts** → send the
  PayPal/bank transfer manually → paste the txn reference → click **Mark
  paid**. The clipper's balance updates instantly.
- **Backups**: Supabase free tier includes daily backups. For production,
  upgrade to Pro ($25/mo) for point-in-time recovery.

Questions? The schema is in `supabase/schema.sql` — read the comments.
