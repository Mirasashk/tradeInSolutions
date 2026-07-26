# Context — lib/cms

## Purpose

Build-time CMS data access via Firebase Admin SDK. Reads published Firestore documents for static site generation.

## Key files

- admin.ts: Firebase Admin initialization and helpers
- fetch.ts: Published-content fetch functions (mirrors former Sanity API)
- defaults.ts: Fallback content when Firestore is empty or unavailable

## Implemented

- [x] Admin SDK init with service account or ADC
- [x] Singleton and collection fetch for all content types
- [x] Default fallbacks for site settings, navigation, home page
- [x] `publishedAt` preserved through `stripMeta` (normalized to an ISO string) since blog posts and testimonials display it as content

## Remaining

- [ ] None

## Conventions

- Only reads documents with `status: "published"`.
- Maps Firestore doc IDs to `_id` for compatibility with existing page components.
- Meta fields (`status`, `updatedAt`, `legacySanityId`) are stripped before data crosses to components; `publishedAt` is kept as an ISO string.

## Notes

- Set `FIREBASE_SERVICE_ACCOUNT_JSON` in CI or `GOOGLE_APPLICATION_CREDENTIALS` locally for builds.
