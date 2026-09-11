import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { meta } from "../../content_option";
import useGoogleAnalytics from "../../hooks/useGoogleAnalytics ";
import { usePageToc } from "../../hooks/usePageToc";
import { PageTocDesktop, PageTocMobile } from "../../components/page-toc";
import { PageBreadcrumb } from "../../components/page-breadcrumb";
import { extendNavTrail, readNavTrail } from "../../utils/navTrail";

const TOC_ITEMS = [
  { id: "reloop-upd-sep10", label: "Sep 10 · Recurring & banners" },
  { id: "reloop-upd-sep6", label: "Sep 6 · Trust & App Store" },
  { id: "reloop-upd-sep5", label: "Sep 5 · UX & pickup" },
  { id: "reloop-upd-sep3", label: "Sep 3 · Account & checkout" },
  { id: "reloop-upd-sep2", label: "Sep 2 · Production readiness" },
];

export const ReLoopUpdates = () => {
  useGoogleAnalytics("G-ZVC52HVG8Q");
  const toc = usePageToc(TOC_ITEMS);
  const location = useLocation();
  const trail =
    readNavTrail(location) ||
    extendNavTrail(null, { label: "ReLoop", to: "/reloop" }, "my-work");

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> ReLoop Developer News | {meta.title} </title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <PageBreadcrumb trail={trail} current="Developer News" />
            <h1 className="display-4 mb-4" style={{ fontSize: "3.8rem" }}>
              ReLoop Developer News
            </h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="12">
            <p className="reloop-lead">
              Chronological engineering ship notes from building Reloop v1 –
              what shipped, why it mattered, and what it unlocked.
            </p>
          </Col>
        </Row>

        <PageTocMobile toc={toc} />

        <Row className="page-toc-content-row">
          <Col lg="9">
            <section id="reloop-upd-sep10" className="sec_sp page-toc-section">
              <h3 className="color_sec py-4 reloop-h3" style={{ fontSize: "2rem" }}>
                September 10, 2026 – Recurring listings, store banners, cart v2
                &amp; vendor ops
              </h3>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Recurring bags that won&apos;t invent a pickup date
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Vendors with predictable surplus were
                    retyping the same listing every week – and a silent
                    &quot;just make it a one-off&quot; fallback would lie about
                    when the next bag is actually pickable.
                  </li>
                  <li>
                    <b>Action:</b> I shipped recurring listings on the client (
                    <code>this_week</code> / weekly + weekday picker). Create,
                    edit, and reactivate all use recurrence to set the next
                    pickup date. Validation requires frequency plus at least one
                    weekday, rejects windows with no upcoming open slot, and
                    refuses to save without valid recurrence. Reactivate
                    respects weekdays and the <code>this_week</code>{" "}
                    until-Sunday bound.
                  </li>
                  <li>
                    <b>Result:</b> Weekly surplus becomes a schedule, not a
                    copy-paste chore – and the app won&apos;t invent a pickup
                    day the store can&apos;t honor.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Store banners and a cart that tells the truth
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Stores looked generic without a hero face,
                    and carts could keep ghost lines after listings vanished –
                    especially across accounts and multiple partners.
                  </li>
                  <li>
                    <b>Action:</b> Vendors edit a banner at a fixed{" "}
                    <code>{"{partnerId}/banner.jpg"}</code> path; customers see
                    it on the store hero. Cart storage v2 is per-user and
                    multi-partner, with legacy migration, invalid-line
                    stripping, rehydrate-against-live-listings, and a banner
                    when lines were removed. Orders, favorites, and listing
                    cards got matching polish.
                  </li>
                  <li>
                    <b>Result:</b> The storefront looks intentional, and the
                    cart admits when the shelf changed instead of
                    checkout-failing on ghosts.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Vendor home, status buckets, and confirm-pickup that you can
                  feel
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Vendor home didn&apos;t push &quot;list
                    something now,&quot; listings mixed every lifecycle state in
                    one pile, and pickup confirmation at the counter needed to
                    be unmistakable without fighting Reduce Motion or
                    double-taps.
                  </li>
                  <li>
                    <b>Action:</b> I reworked vendor home with a new-listing
                    quick action, added live / sold out / expired / inactive
                    filters, and shipped a dedicated confirm-pickup control with
                    fill/pulse motion plus haptics – blocked while disabled or
                    loading, and quiet when Reduce Motion is on.
                  </li>
                  <li>
                    <b>Result:</b> Vendors can find what&apos;s sellable,
                    publish faster, and confirm pickup with one clear,
                    accessible gesture.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Honest split: client rules now, DB guarantees next
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Most CHECK constraints, expire/advance RPC,
                    banner grants, and Storage RLS still live in uncommitted
                    migration files – shipping UI without saying so would
                    overclaim security.
                  </li>
                  <li>
                    <b>Action:</b> This push documents the split: client
                    safeguards ship now; the next commit unlocks
                    frequency/weekday/<code>until</code> CHECKs,{" "}
                    <code>deactivate_expired_listings</code> (advance recurring
                    only when safe; expire one-offs / exhausted{" "}
                    <code>this_week</code>; service_role only), non-privileged
                    banner column grants, Storage RLS limited to{" "}
                    <code>logo.jpg</code> / <code>banner.jpg</code> for
                    members/owners, and shared weekday/open-window helpers.
                  </li>
                  <li>
                    <b>Result:</b> The product surface matches reality – client
                    rules hold today; Postgres CHECKs, expire/advance, and
                    Storage RLS harden when the remaining files land.
                  </li>
                </ul>
              </div>
            </section>

            <section id="reloop-upd-sep6" className="sec_sp page-toc-section">
              <h3 className="color_sec py-4 reloop-h3" style={{ fontSize: "2rem" }}>
                September 6, 2026 – Listing reviews, content reports, Place IDs
                &amp; App Store polish
              </h3>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">Trust after pickup: reviews and reports</h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Without a clear post-pickup rating path and a
                    safe way to flag bad content, the marketplace cannot build
                    trust before App Store review – and staff cannot hide abuse
                    without trusting the client.
                  </li>
                  <li>
                    <b>Action:</b> I shipped one listing (bag) rating per purchased
                    checkout after pickup, with <code>rating_avg</code> /{" "}
                    <code>rating_count</code> on listings and a rebuilt store
                    rating sheet. Customers can report listings, stores, and
                    picked-up orders (insert/select their own rows only); staff
                    hide content from the dashboard – no client status updates. SQL
                    tests cover both flows, with en/lo copy for report and review
                    UI.
                  </li>
                  <li>
                    <b>Result:</b> Trust and moderation sit in the database and
                    staff tools, so Apple review sees a finished product surface
                    instead of half-wired safety features.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">Maps that stay honest about address truth</h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> &quot;Open in Maps&quot; was unreliable when
                    partners lacked a stable Places identity, but Reloop&apos;s
                    own address and coordinates must remain the source of truth.
                  </li>
                  <li>
                    <b>Action:</b> I added optional{" "}
                    <code>partners.google_place_id</code> from Places lookup, a
                    place-lookup Edge Function, shared address parsing, and a
                    clearer vendor pin picker.
                  </li>
                  <li>
                    <b>Result:</b> Maps deep-links are more reliable without
                    letting an external Places result overwrite Reloop&apos;s
                    address or lat/lng.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Account security and a cleaner customer shell
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Sign in with Apple and delete-account needed
                    production-grade behavior, and profile on the tab bar competed
                    with Home, Orders, and Favorites as primary destinations.
                  </li>
                  <li>
                    <b>Action:</b> I strengthened Sign in with Apple (native iOS
                    path and branding) and best-effort Apple token revoke on
                    delete-account when Edge secrets are set. Profile moved off
                    the tab bar onto a stack; report entry points landed on
                    listing, store, and order screens, with verify-email, pickup
                    code, keyboard Done accessory, and home polish.
                  </li>
                  <li>
                    <b>Result:</b> Auth and account deletion match App Store
                    expectations, and the main tabs stay focused on shopping and
                    fulfillment.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">Branding, docs, and CI parity</h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Icons, schema notes, and checklists were out of
                    date relative to the report, review, and Apple-revoke
                    work – and i18n/maps regressions could slip without shared
                    tests in CI.
                  </li>
                  <li>
                    <b>Action:</b> I replaced mobile and web icons with the Reloop
                    logo (including iOS tinted and notification icons), updated{" "}
                    <code>SCHEMA.md</code>, Apple iOS notes, tester sheets, and
                    the App Store checklist, and wired shared i18n-parity and
                    maps-address tests into CI.
                  </li>
                  <li>
                    <b>Result:</b> Branding, docs, and automated checks tell the
                    same story as the shipped app.
                  </li>
                </ul>
              </div>
            </section>

            <section id="reloop-upd-sep5" className="sec_sp page-toc-section">
              <h3 className="color_sec py-4 reloop-h3" style={{ fontSize: "2rem" }}>
                September 5, 2026 – Themed dialogs, haptics, cart motion &amp;
                vendor pickup polish
              </h3>
              <ul className="reloop-list">
                <li>
                  <b>Problem:</b> Native alerts and flat order detail screens made
                  the app feel unfinished – especially on the vendor side, where
                  pickup confirmation needs to be fast and unmistakable at the
                  counter.
                </li>
                <li>
                  <b>Action:</b> I replaced native alerts with themed dialog hooks,
                  added <code>expo-haptics</code> feedback and a cart fly-to-tab
                  animation, shipped custom tab icons, and redesigned vendor order
                  detail with pickup code entry, a receipt ticket, and store
                  preview. Shared local-datetime helpers now own pickup windows,
                  with matching lo/en copy.
                </li>
                <li>
                  <b>Result:</b> Customer and vendor flows feel like one product
                  system – feedback, motion, and pickup confirmation reinforce
                  the same pickup-first loop.
                </li>
              </ul>
            </section>

            <section id="reloop-upd-sep3" className="sec_sp page-toc-section">
              <h3 className="color_sec py-4 reloop-h3" style={{ fontSize: "2rem" }}>
                September 3, 2026 – Profile settings, in-app legal pages &amp;
                delete-account
              </h3>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Profile settings, legal pages &amp; delete-account
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> Account actions buried in the wrong place,
                    legal pages that bounced out of the app, and no safe server
                    path to delete an account block App Store readiness and make
                    support harder.
                  </li>
                  <li>
                    <b>Action:</b> I moved account actions into Settings, hosted
                    terms, privacy, and food-safety pages in-app, and added a
                    delete-account Edge Function. Order list/realtime updates
                    landed in the same pass; Sentry native upload stays disabled
                    until org credentials exist.
                  </li>
                  <li>
                    <b>Result:</b> Customers manage account and legal context
                    without leaving Reloop, and account deletion is a controlled
                    server action – not a client-only wipe.
                  </li>
                </ul>
              </div>

              <div className="reloop-stack-group">
                <h4 className="reloop-h4">
                  Checkout, store reviews, pickup QR &amp; EAS builds
                </h4>
                <ul className="reloop-list">
                  <li>
                    <b>Problem:</b> The customer order loop was incomplete without
                    checkout, receipt, and a scannable pickup path – and payment
                    expire, listing, and notification RLS needed hardening before
                    production builds.
                  </li>
                  <li>
                    <b>Action:</b> I finished checkout, receipt, and pickup QR on
                    the customer side, added vendor scan and partner ratings, and
                    tightened payment expire, listing, and notification RLS. EAS
                    config, ADRs, and agent standards landed so{" "}
                    <code>main</code> matches the current app.
                  </li>
                  <li>
                    <b>Result:</b> End-to-end pickup works from pay to scan, with
                    security and build tooling aligned to what ships.
                  </li>
                </ul>
              </div>
            </section>

            <section id="reloop-upd-sep2" className="sec_sp page-toc-section">
              <h3 className="color_sec py-4 reloop-h3" style={{ fontSize: "2rem" }}>
                September 2, 2026 – Production readiness (Phases A–C), CI &amp;
                Realtime
              </h3>
              <ul className="reloop-list">
                <li>
                  <b>Problem:</b> Auth hydration, stale order state, unpaid pending
                  orders, and missing observability made &quot;almost
                  production&quot; risky – and mobile lint debt blocked a clean
                  React Compiler-friendly main.
                </li>
                <li>
                  <b>Action:</b> I shipped auth bootstrap with React Query
                  hydration, Realtime hooks, an{" "}
                  <code>expire_pending_payment_orders</code> RPC, Sentry, tab
                  error states, and GitHub Actions CI. Mobile ESLint errors for
                  React Compiler rules are fixed; session handoff lives in{" "}
                  <code>docs/temporary</code>; the accidental{" "}
                  <code>supabase/supabase</code> duplicate config is removed.
                </li>
                <li>
                  <b>Result:</b> The app boots into a trustworthy session, pending
                  payments expire on the server, and CI catches regressions before
                  they reach a device build.
                </li>
              </ul>
            </section>
          </Col>

          <Col lg="3" className="page-toc-col d-none d-lg-block">
            <PageTocDesktop toc={toc} />
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
