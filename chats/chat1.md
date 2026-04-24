# Viral Clip Marketplace

_Started 2026-04-24 16:21 UTC_

---

## User

so I'm currently building two apps that I'm going to need to market, so I came up with a brilliant idea. I'm going to have a system, a kind of clipping system, where I would personally hire, in third world countries, as many video editors as possible. I would give them the clips or raw footage, or just give them the app that I'm trying to promote and send them inspiration formats that are currently going viral in that kind of space so they can actually get views. Their job is to go ahead and start posting these videos to get views, and for every 1,000 views we pay them on this set RPFS.

The website is going to be a really good website so it looks legit so that they know they're actually going to get paid. There's going to be some testimonials. There's going to be a section that talks about their supervisor or the owner of this, and then that section is going to include me. It's going to include my testimonials, my own channel, and excited YouTube channels so they know I actually make money and I have money to pay them.

Anyway, there are going to be two campaigns at the moment because I currently have two apps only, but obviously I'm just giving you the whole backstory. I should be able to come on the page, maybe sign up and log in, because they'll be able to request their payouts via their PayPal or put their bank details, and we will manually pay it. Here I'll be able to set my RPFS that I want to be paying them 1,000 views and the stuff like that, if that makes sense. It's essentially a clip-in system, but we want it to be really visually appealing so it looks very professional and it looks very modern and smooth with really good UIs.

## Assistant

I'll dig into the Payload design system first to see what's already built, then ask focused questions before designing.

_[tool: list_files]_

_[tool: list_files]_

There's already a substantial UI kit in the Payload design system — marketing site, clipper dashboard, admin dashboard. Rather than rebuild from scratch, I should understand what exists, then forge a polished direction with you. Let me gather a few key details before building.

_[tool: view_image]_

_[tool: view_image]_

_[tool: questions_v2]_

## User

Questions timed out; go with defaults

## Assistant

I'll go with sensible defaults: build all three surfaces (marketing + clipper + admin) as one clickable prototype with Tweaks to switch between them and cycle a few hero variations. Let me explore the UI kit thoroughly before writing.

_[tool: update_todos]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

Let me read all the existing UI kit components so I can fork and elevate them rather than rebuild.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

I have a complete picture of the existing kit. Time to fork it into the project as one unified clickable prototype with a surface switcher + Tweaks.

Strategy:
- Copy the whole UI kit + tokens + assets into the project
- Build a top-level `Clippr.html` that mounts either Marketing / Clipper / Admin based on a surface state, with a small "prototype chrome" switcher so you can jump between
- Sign up / Log in on marketing navigates to the clipper dashboard
- Add Tweaks panel: toggle RPM, swap active surface, cycle hero headline, show/hide the ticker
- The existing components are already strong — I'll fork + add polish (smoother transitions, state wiring) rather than rewrite

_[tool: copy_files]_

_[tool: copy_starter_component]_

_[tool: snip]_

_[tool: read_file]_

_[tool: snip]_

Now I'll build the unified prototype. The existing components are strong — I'll write a new top-level app that mounts the three surfaces, adds a prototype chrome switcher, wires auth → clipper dashboard, and adds Tweaks.

_[tool: write_file]_

_[tool: snip]_

Now I'll delete the old duplicate shared.jsx files from sub-folders (I'm consolidating into `src/shared.jsx`) and update the existing component files to use it. Simpler: I'll just leave the copied components as-is and OVERRIDE their `window.*` exports with my consolidated versions by loading `src/shared.jsx` AFTER them... actually cleaner: load shared.jsx FIRST, and delete the redundant `shared.jsx` sub-files so they don't clobber.

_[tool: delete_file]_

_[tool: snip]_

Now I'll build the three lightly-adapted components that need small fixes (Button variants, Ghost text color), plus the top-level prototype shell. I'll inline the dashboard/admin components into their own files with the right `ghost` variant handling (light-world ghost needs black text).

Let me fix the Button `ghost` variant in shared since many components use it on light backgrounds:

_[tool: str_replace_edit]_

[Main agent continues working silently]

_[tool: snip]_

Now I'll update the marketing Nav to use ghostDark (since Button now defaults ghost to light-world) and fix the marketing Button ref since its embedded `primary` expected pill-glow. Actually, since the marketing uses different component files, let me inspect the existing Nav.jsx / Hero.jsx to see what variants they use — they call `variant="ghost"` on dark. Let me update those.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

[Main agent continues working silently]

_[tool: snip]_

Now let me build the main prototype shell. I'll write it to use the existing components directly.

_[tool: write_file]_

[Main agent continues working silently]

_[tool: snip]_

[Main agent continues working silently]

_[tool: snip]_

_[tool: write_file]_

[Main agent continues working silently]

_[tool: snip]_

I need to wire a few things: Hero needs to accept a `variant` prop for tweakable headlines, AuthModal needs `onSuccess`, and I should use tweak RPM. Let me also make those wiring changes and then call `done`.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Clippr prototype is live at `Clippr.html` with all three surfaces wired together.

**What's in:**
- **Marketing** (dark) — hero, payout ticker, how it works, campaigns grid (Rizz live + slot #2), Kevis proof section with YouTube stats, testimonials, CTA footer, auth modal. Sign up from any CTA drops you into the clipper dashboard.
- **Clipper dashboard** (light) — overview (KPIs, 30-day earnings chart, next payout card, recent clips table), campaigns list, submit-clip modal, payouts panel with history.
- **Admin dashboard** (light) — overview with action items, review queue with clip detail + checklist, campaign editor with RPM/budget controls, payouts release table with multi-select.

**Prototype chrome:**
- Top-center pill dock → jump between Marketing / Clipper / Admin at any time
- Tweaks panel (bottom-right, toggle from toolbar) — switch surface, cycle hero headline, show/hide ticker, adjust RPM, swap brand name + accent color

**Caveats / next steps:**
- Second campaign is intentionally "Coming soon" placeholder — send me the second app name and I'll build its campaign card + brief
- Copy uses "Payload" throughout (from the design system); swap via the Brand tweak or I can find/replace if you want it to say "Clippr"
- Content is realistic but placeholder (Kevis's $300K stat, testimonial quotes) — replace with your actual receipts before launch

