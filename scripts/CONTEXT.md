# Context — scripts

## Purpose

Operational Node scripts run manually against Firebase (Firestore + Storage) with admin credentials: admin bootstrap, one-time Sanity migration, and full CMS content seeding.

## Key files

- seed-cms-content.mjs: seeds the complete CMS content set (singletons + all collections) and uploads images from `/assets` to Storage. Run via `npm run seed:cms` (add `-- --prune` to demote non-seed published docs to draft).
- seed-admin.mjs: writes an `admins/{uid}` document to grant admin panel access.
- migrate-sanity-to-firestore.mjs: one-time legacy migration from Sanity.
- lib/: shared helpers (service account loading, Storage image upload).
- data/: seed content datasets consumed by seed-cms-content.mjs.

## Implemented

- [x] Admin user bootstrap
- [x] Sanity → Firestore migration
- [x] Full CMS content seed with image upload, idempotent upsert (match by slug/name/question/label/text), and optional `--prune`
- [x] Date-only `publishedAt` values normalized to midday to avoid timezone off-by-one on display

## Remaining

- [ ] Nothing planned

## Conventions

- Scripts are `.mjs`, run with `node --env-file=.env` from the repo root.
- Credentials come from `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON` (see lib/load-service-account.mjs).
- `scripts/**` is excluded from ESLint (see eslint.config.mjs).

## Notes

- seed-cms-content.mjs replaced the older seed-cms-defaults.mjs (placeholder-only) with real site content.
- Deterministic doc IDs (slugs) are used for newly created collection docs; existing docs are matched and updated in place to avoid duplicates.
