# Recent ReLoop Updates - draft source

Mirrors the live Recent Reloop Updates page (`/recent-reloop-updates`, `src/pages/reloop_updates/index.js`).
Each entry follows the page standard: first-person Problem / Action / Result.

---

## September 6, 2026 - Listing reviews, content reports, Place IDs & App Store polish

### Trust after pickup: reviews and reports

- **Problem:** Without a clear post-pickup rating path and a safe way to flag bad content, the marketplace cannot build trust before App Store review-and staff cannot hide abuse without trusting the client.
- **Action:** I shipped one listing (bag) rating per purchased checkout after pickup, with `rating_avg` / `rating_count` on listings and a rebuilt store rating sheet. Customers can report listings, stores, and picked-up orders (insert/select their own rows only); staff hide content from the dashboard-no client status updates. SQL tests cover both flows, with en/lo copy for report and review UI.
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

- **Problem:** Icons, schema notes, and checklists were out of date relative to the report, review, and Apple-revoke work-and i18n/maps regressions could slip without shared tests in CI.
- **Action:** I replaced mobile and web icons with the Reloop logo (including iOS tinted and notification icons), updated `SCHEMA.md`, Apple iOS notes, tester sheets, and the App Store checklist, and wired shared i18n-parity and maps-address tests into CI.
- **Result:** Branding, docs, and automated checks tell the same story as the shipped app.

---

## September 5, 2026 - Themed dialogs, haptics, cart motion & vendor pickup polish

- **Problem:** Native alerts and flat order detail screens made the app feel unfinished-especially on the vendor side, where pickup confirmation needs to be fast and unmistakable at the counter.
- **Action:** I replaced native alerts with themed dialog hooks, added `expo-haptics` feedback and a cart fly-to-tab animation, shipped custom tab icons, and redesigned vendor order detail with pickup code entry, a receipt ticket, and store preview. Shared local-datetime helpers now own pickup windows, with matching lo/en copy.
- **Result:** Customer and vendor flows feel like one product system-feedback, motion, and pickup confirmation reinforce the same pickup-first loop.

---

## September 3, 2026 - Profile settings, in-app legal pages & delete-account

- **Problem:** Account actions buried in the wrong place, legal pages that bounced out of the app, and no safe server path to delete an account block App Store readiness and make support harder.
- **Action:** I moved account actions into Settings, hosted terms, privacy, and food-safety pages in-app, and added a delete-account Edge Function. Order list/realtime updates landed in the same pass; Sentry native upload stays disabled until org credentials exist.
- **Result:** Customers manage account and legal context without leaving Reloop, and account deletion is a controlled server action-not a client-only wipe.

### Checkout, store reviews, pickup QR & EAS builds

- **Problem:** The customer order loop was incomplete without checkout, receipt, and a scannable pickup path-and payment expire, listing, and notification RLS needed hardening before production builds.
- **Action:** I finished checkout, receipt, and pickup QR on the customer side, added vendor scan and partner ratings, and tightened payment expire, listing, and notification RLS. EAS config, ADRs, and agent standards landed so `main` matches the current app.
- **Result:** End-to-end pickup works from pay to scan, with security and build tooling aligned to what ships.

---

## September 2, 2026 - Production readiness (Phases A–C), CI & Realtime

- **Problem:** Auth hydration, stale order state, unpaid pending orders, and missing observability made “almost production” risky-and mobile lint debt blocked a clean React Compiler-friendly main.
- **Action:** I shipped auth bootstrap with React Query hydration, Realtime hooks, an `expire_pending_payment_orders` RPC, Sentry, tab error states, and GitHub Actions CI. Mobile ESLint errors for React Compiler rules are fixed; session handoff lives in `docs/temporary`; the accidental `supabase/supabase` duplicate config is removed.
- **Result:** The app boots into a trustworthy session, pending payments expire on the server, and CI catches regressions before they reach a device build.
