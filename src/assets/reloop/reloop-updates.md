# ReLoop Developer News – draft source

Mirrors the live Reloop Developer News page (`/recent-reloop-updates`, `src/pages/reloop_updates/index.js`).
Each entry follows the page standard: first-person Problem / Action / Result.

---

## Paste-ready GitHub ship notes (Sep 10, 2026)

```markdown
# Recurring bags, store banners, and a cart that tells the truth

Reloop is a TooGoodToGo-style surplus marketplace for Vientiane – one Expo app, two experiences, pickup-first. This push makes the weekly grind less grind-y for vendors, gives stores a real face, and stops the client from inventing pickup dates or keeping ghost bags in the cart.

## What shipped

### Vendors stop retyping the same bag
- Recurring listings: `this_week` / weekly with a weekday picker
- Create, edit, and reactivate all use recurrence to set the next pickup date
- Vendor home: new-listing quick action + reworked home content
- Listings filter into live / sold out / expired / inactive – “what’s actually sellable?” is one glance

### Stores look like stores
- Vendors edit a banner; customers see it on the store hero
- Fixed path: `{partnerId}/banner.jpg` – no mystery filenames

### Counter energy
- Confirm pickup is its own button: fill/pulse motion + haptics
- Respects Reduce Motion; disabled/loading blocks double-taps

### Customer polish + cart v2
- Store banner UI, plus orders / favorites / listing card updates
- Cart storage v2: per-user, multi-partner carts (with legacy migration)
- Rehydrate against live listings, drop gone items, and show a banner when lines were removed

## Client safeguards (in this push)

The hard DB guarantees are not in this commit yet – so the client refuses to lie in the meantime:

- Form validation: frequency + at least one weekday; reject when there’s no upcoming open window
- Save path requires valid recurrence (won’t silently invent a one-off)
- Reactivate respects weekdays and `this_week` until Sunday
- Cart: per-user keys; strip invalid lines; rehydrate vs live listings
- Confirm-pickup motion respects Reduce Motion; no presses while disabled/loading

## Still in the next commit (DB safeguards)

When the remaining files land, you also get:

- CHECK constraints: frequency enum, weekdays ⊂ 0–6, frequency↔weekdays↔until pairing
- `deactivate_expired_listings`: advance recurring pickups; don’t advance if open orders; expire one-offs / exhausted `this_week`; service_role only
- Banner column grants: only non-privileged partner columns (incl. `banner_storage_path`) updatable by clients
- Storage RLS: writes only for `logo.jpg` / `banner.jpg` under the partner’s path, members/owners only
- Shared helpers: normalize weekdays, honor `this_week` until, only pick dates with an open window

Small team, honest rules: ship client safeguards today rather than a pretty lie waiting on migrations.
```

---

## September 10, 2026 – Recurring listings, store banners, cart v2 & vendor ops

### Recurring bags that won’t invent a pickup date

- **Problem:** Vendors with predictable surplus were retyping the same listing every week – and a silent “just make it a one-off” fallback would lie about when the next bag is actually pickable.
- **Action:** I shipped recurring listings on the client (`this_week` / weekly + weekday picker). Create, edit, and reactivate all use recurrence to set the next pickup date. Validation requires frequency plus at least one weekday, rejects windows with no upcoming open slot, and refuses to save without valid recurrence. Reactivate respects weekdays and the `this_week` until-Sunday bound.
- **Result:** Weekly surplus becomes a schedule, not a copy-paste chore – and the app won’t invent a pickup day the store can’t honor.

### Store banners and a cart that tells the truth

- **Problem:** Stores looked generic without a hero face, and carts could keep ghost lines after listings vanished – especially across accounts and multiple partners.
- **Action:** Vendors edit a banner at a fixed `{partnerId}/banner.jpg` path; customers see it on the store hero. Cart storage v2 is per-user and multi-partner, with legacy migration, invalid-line stripping, rehydrate-against-live-listings, and a banner when lines were removed. Orders, favorites, and listing cards got matching polish.
- **Result:** The storefront looks intentional, and the cart admits when the shelf changed instead of checkout-failing on ghosts.

### Vendor home, status buckets, and confirm-pickup that you can feel

- **Problem:** Vendor home didn’t push “list something now,” listings mixed every lifecycle state in one pile, and pickup confirmation at the counter needed to be unmistakable without fighting Reduce Motion or double-taps.
- **Action:** I reworked vendor home with a new-listing quick action, added live / sold out / expired / inactive filters, and shipped a dedicated confirm-pickup control with fill/pulse motion plus haptics – blocked while disabled or loading, and quiet when Reduce Motion is on.
- **Result:** Vendors can find what’s sellable, publish faster, and confirm pickup with one clear, accessible gesture.

### Honest split: client rules now, DB guarantees next

- **Problem:** Most CHECK constraints, expire/advance RPC, banner grants, and Storage RLS still live in uncommitted migration files – shipping UI without saying so would overclaim security.
- **Action:** This push documents the split: client safeguards ship now; the next commit unlocks frequency/weekday/`until` CHECKs, `deactivate_expired_listings` (advance recurring only when safe; expire one-offs / exhausted `this_week`; service_role only), non-privileged banner column grants, Storage RLS limited to `logo.jpg` / `banner.jpg` for members/owners, and shared weekday/open-window helpers.
- **Result:** The product surface matches reality – client rules hold today; Postgres CHECKs, expire/advance, and Storage RLS harden when the remaining files land.

---

## September 6, 2026 – Listing reviews, content reports, Place IDs & App Store polish

### Trust after pickup: reviews and reports

- **Problem:** Without a clear post-pickup rating path and a safe way to flag bad content, the marketplace cannot build trust before App Store review – and staff cannot hide abuse without trusting the client.
- **Action:** I shipped one listing (bag) rating per purchased checkout after pickup, with `rating_avg` / `rating_count` on listings and a rebuilt store rating sheet. Customers can report listings, stores, and picked-up orders (insert/select their own rows only); staff hide content from the dashboard – no client status updates. SQL tests cover both flows, with en/lo copy for report and review UI.
- **Result:** Trust and moderation sit in the database and staff tools, so Apple review sees a finished product surface instead of half-wired safety features.

### Maps that stay honest about address truth

- **Problem:** “Open in Maps” was unreliable when partners lacked a stable Places identity, but Reloop’s own address and coordinates must remain the source of truth.
- **Action:** I added optional `partners.google_place_id` from Places lookup, a place-lookup Edge Function, shared address parsing, and a clearer vendor pin picker.
- **Result:** Maps deep-links are more reliable without letting an external Places result overwrite Reloop’s address or lat/lng.

### Account security and a cleaner customer shell

- **Problem:** Sign in with Apple and delete-account needed production-grade behavior, and profile on the tab bar competed with Home, Orders, and Favorites as primary destinations.
- **Action:** I strengthened Sign in with Apple (native iOS path and branding) and best-effort Apple token revoke on delete-account when Edge secrets are set. Profile moved off the tab bar onto a stack; report entry points landed on listing, store, and order screens, with verify-email, pickup code, keyboard Done accessory, and home polish.
- **Result:** Auth and account deletion match App Store expectations, and the main tabs stay focused on shopping and fulfillment.

### Branding, docs, and CI parity

- **Problem:** Icons, schema notes, and checklists were out of date relative to the report, review, and Apple-revoke work – and i18n/maps regressions could slip without shared tests in CI.
- **Action:** I replaced mobile and web icons with the Reloop logo (including iOS tinted and notification icons), updated `SCHEMA.md`, Apple iOS notes, tester sheets, and the App Store checklist, and wired shared i18n-parity and maps-address tests into CI.
- **Result:** Branding, docs, and automated checks tell the same story as the shipped app.

---

## September 5, 2026 – Themed dialogs, haptics, cart motion & vendor pickup polish

- **Problem:** Native alerts and flat order detail screens made the app feel unfinished – especially on the vendor side, where pickup confirmation needs to be fast and unmistakable at the counter.
- **Action:** I replaced native alerts with themed dialog hooks, added `expo-haptics` feedback and a cart fly-to-tab animation, shipped custom tab icons, and redesigned vendor order detail with pickup code entry, a receipt ticket, and store preview. Shared local-datetime helpers now own pickup windows, with matching lo/en copy.
- **Result:** Customer and vendor flows feel like one product system – feedback, motion, and pickup confirmation reinforce the same pickup-first loop.

---

## September 3, 2026 – Profile settings, in-app legal pages & delete-account

- **Problem:** Account actions buried in the wrong place, legal pages that bounced out of the app, and no safe server path to delete an account block App Store readiness and make support harder.
- **Action:** I moved account actions into Settings, hosted terms, privacy, and food-safety pages in-app, and added a delete-account Edge Function. Order list/realtime updates landed in the same pass; Sentry native upload stays disabled until org credentials exist.
- **Result:** Customers manage account and legal context without leaving Reloop, and account deletion is a controlled server action – not a client-only wipe.

### Checkout, store reviews, pickup QR & EAS builds

- **Problem:** The customer order loop was incomplete without checkout, receipt, and a scannable pickup path – and payment expire, listing, and notification RLS needed hardening before production builds.
- **Action:** I finished checkout, receipt, and pickup QR on the customer side, added vendor scan and partner ratings, and tightened payment expire, listing, and notification RLS. EAS config, ADRs, and agent standards landed so `main` matches the current app.
- **Result:** End-to-end pickup works from pay to scan, with security and build tooling aligned to what ships.

---

## September 2, 2026 – Production readiness (Phases A–C), CI & Realtime

- **Problem:** Auth hydration, stale order state, unpaid pending orders, and missing observability made “almost production” risky – and mobile lint debt blocked a clean React Compiler-friendly main.
- **Action:** I shipped auth bootstrap with React Query hydration, Realtime hooks, an `expire_pending_payment_orders` RPC, Sentry, tab error states, and GitHub Actions CI. Mobile ESLint errors for React Compiler rules are fixed; session handoff lives in `docs/temporary`; the accidental `supabase/supabase` duplicate config is removed.
- **Result:** The app boots into a trustworthy session, pending payments expire on the server, and CI catches regressions before they reach a device build.
