# Context — scripts/lib

## Purpose

Shared helpers for the operational scripts: Firebase Admin initialization/credential loading and Storage image uploads.

## Key files

- load-service-account.mjs: resolves a service account from `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON` (inline JSON or file path) and initializes firebase-admin.
- upload-image.mjs: uploads a local image to Firebase Storage and returns a `CmsImage` (`{ storagePath, url, alt }`); idempotent — reuses the existing object and download token when present.

## Implemented

- [x] Service account loading from env (path or inline JSON)
- [x] Storage upload with Firebase download-token URLs and long-lived cache headers

## Remaining

- [ ] Nothing planned

## Conventions

- Helpers take dependencies (e.g. the Storage bucket) as arguments; no module-level Firebase initialization besides `initFirebaseAdmin`.
- Storage paths follow the admin-upload convention: `cms/<collection>/<docId>/<fileName>` (matches storage.rules).

## Notes

- Download URLs use the `firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media&token=` format so they match URLs produced by the client-side admin uploader.
