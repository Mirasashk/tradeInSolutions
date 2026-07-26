# Decisions

## 2026-07-26 — CMS content seeding & legacy asset mapping

**Seed strategy.** `scripts/seed-cms-content.mjs` (npm run `seed:cms`) seeds every CMS schema with real content taken from the original WordPress site. It upserts: existing docs are matched by a natural key (slug / name / question / label / text) and updated in place; new docs get deterministic slug IDs. `--prune` demotes published docs that aren't part of the seed to `draft` (never deletes). It replaced `seed-cms-defaults.mjs`.

**publishedAt is content, not just meta.** Blog posts and testimonials display `publishedAt`, so `stripMeta` in `lib/cms/fetch.ts` now preserves it (normalized to an ISO string). Seeded date-only values are anchored to `T12:00:00` to avoid timezone off-by-one in rendered dates.

**Legacy image mapping (from `/assets`, uploaded to Storage under `cms/<collection>/<docId>/<file>`):**

| Asset                                                                                                                                                                                       | Placement                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `REVO_04.png` (1399×450 slider photo)                                                                                                                                                       | Homepage hero background + default OG image |
| `Tis-Front-1.jpg`                                                                                                                                                                           | Irvine location photo                       |
| `tis_LA.jpg`                                                                                                                                                                                | West LA location photo                      |
| `tis_SD.jpg` ("appraiser will come to you")                                                                                                                                                 | San Diego field-appraisal location photo    |
| `yelp_icn.png`                                                                                                                                                                              | Yelp trust badge icon                       |
| `Reduce-fuel.jpg`, `Corrosion-scaled.jpg`, `1.jpg`, `ICO_Slide_900x480_Blue.png`, `Salvage.jpg`, `Selling-to-a-Dealer.jpeg`, `Forecast-1.jpg`, `AC.jpg`, `Battery.jpg`, `TireTreadTest.jpg` | Blog post main images (one per post)        |

**Intentionally unused assets:** WordPress slider layers and UI chrome (`lyr_*`, `REVO_01–03`, `msg_*`, buttons/icons like `appraisal_button_d.png`, `contact.png`, `location.png`, `telextra.png`, `tis_phone.png`, `smiley.png`), infographics recreated as native components (`home-whyus.png` → Why Us cards, `3_steps_01.png` → ProcessTimeline), low-res banner duplicates (`tis_img_*`, `lyr_*`), the BusinessRate award letter scan (`2025_Google-Business-Rating-scaled.jpg` — represented as a text trust badge instead), and stock photos with no matching post (`CARPHOTO-1550.jpg`, `cf4507ae…XL.jpg`, `oil-change.jpg`, `Car-maintenance-checklist2*.jpg`, `Used-Car-Salesman.jpg`, `Checking-out-a-used-car.jpeg`, `Time-is-Money.jpg`, `Cash.jpg`, `Sell-Your-Car.jpg`, `We-Will-Sell-Your-Car.jpg`, `Dealer.jpg`, `Selling-Your-Car-Yourself-Dangerous.jpg`, `KBBSideBar.jpg`).

**Content notes.**

- Only the 10 first-page blog posts were migrated (per the site outline); the six older 2015-era posts on page 2 were skipped.
- The old FAQ merged the "beat another dealer's offer" content into the leased-car answer; it is now a dedicated FAQ item with `anchorId: "compare-offers"` (the homepage links to `/faq/#compare-offers`).
- Case studies were not seeded — they require real customer data and permission.
- `yelpRating` set to 4.5 (current Yelp aggregate, 100+ reviews), not the aspirational 5.

## 2026-07-26 — Admin panel organization

**Sidebar grouping.** Admin nav split into Dashboard, Operations (Leads, Appointments), and Content Management (all CMS editors). CMS "Appointment" renamed to "Appointment Page" to distinguish from the appointments inbox.

**CMS feedback.** Sonner toasts added for save draft, publish content, publish site, delete, and image upload failures. Firestore writes sanitize `null`/`undefined` optional fields via `deleteField()`.

**Appointments page (v1).** `/admin/appointments/` shows Firestore appointment leads in calendar + list views. Read-only; no Google Calendar sync in this phase.

**Google Calendar sync — deferred.** Options for a future phase:

- Service account + shared Google Calendar (events created on new leads)
- OAuth "Connect Google Calendar" in admin (events on personal primary calendar)
- Store `googleCalendarEventId` on lead docs for updates/cancellations
- Calendly webhooks or two-way sync as later enhancements

**Firestore index.** Added composite index on `leads`: `type` + `preferredDate` (supports appointment reminder query and future date-range fetches).

## 2026-07-26 — CMS version control

**Storage model.** Per-document `versions` subcollections under each CMS collection doc (e.g. `cmsSingletons/homePage/versions/{versionId}`). Snapshots store the **pre-write** document body so diffs answer "what did I just change?"

**Capture.** `cmsVersionOnWrite` Cloud Function (Admin SDK, **1st gen Firestore triggers**) on all 10 CMS collections; client writes include `updatedBy` and optional `restoredFromVersionId`. Uses v1 triggers (not Eventarc) to avoid first-deploy IAM issues with 2nd gen Firestore listeners. Firestore rules: admins read-only on `versions/`; no client writes.

**Retention.** 50 versions per document; oldest deleted after insert.

**Restore policy.** Restore as **draft only** — admin reviews in editor, then publishes content + site via existing SaveBar flow.

**Public fetch.** `stripMeta` in `lib/cms/fetch.ts` strips `updatedBy` and `restoredFromVersionId` so build output is unchanged.
