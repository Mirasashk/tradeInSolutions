# Context — lib/firebase

## Purpose

Client-side Firebase SDK helpers for the admin panel: Auth, Firestore CRUD, and Storage uploads.

## Key files

- auth.ts: Sign in/out and ID token for cmsPublish
- firestore.ts: Admin CMS and leads queries/writes
- storage.ts: Image upload and URL helpers

## Implemented

- [x] Email/password auth helpers
- [x] Singleton and collection CRUD
- [x] Leads inbox queries
- [x] CMS image upload to Storage

## Remaining

- [ ] None

## Conventions

- Browser-only; uses `getFirebaseApp()` from `lib/firebase.ts`.
- Writes require authenticated admin (`admins/{uid}` document).

## Notes

- Public site build uses `lib/cms/` (Admin SDK), not these client modules.
