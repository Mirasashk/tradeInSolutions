# Local Setup Guide

Step-by-step setup for the Trade-In Solutions Irvine Next.js site.

## Prerequisites

- Node.js 22+
- npm
- Firebase CLI (`npm i -g firebase-tools`)
- Firebase project on **Blaze plan** (required for Functions outbound calls to Resend/reCAPTCHA)

## 1. Clone and install

```bash
git clone git@github.com:Mirasashk/tradeInSolutions.git
cd tradeInSolutions
cp .env.example .env.local
npm install
npm ci --prefix functions
```

## 2. Firebase

1. Project: `tradeinsolutions-6f0e9` (see `.firebaserc`)
2. Enable **Firestore**, **Storage**, and **Authentication** (email/password)
3. Register a Web App and copy config to `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradeinsolutions-6f0e9
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. For local builds and seed scripts, point at your service account key file (never commit this file):

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```

   Or pass a file path via `FIREBASE_SERVICE_ACCOUNT_JSON` (same effect for scripts).

5. Deploy rules, auth, and **Firestore indexes** (required for CMS queries in production):

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage,auth
   ```

   If FAQ/blog/locations pages are empty in dev but data exists in admin, indexes may not be deployed yet. The app falls back to in-memory sorting, but you should still deploy indexes for production performance.

6. Set Functions secrets:

   ```bash
   firebase functions:secrets:set RESEND_API_KEY
   firebase functions:secrets:set RESEND_FROM_EMAIL
   firebase functions:secrets:set CONTACT_FORM_TO_EMAIL
   firebase functions:secrets:set RECAPTCHA_SECRET_KEY
   firebase functions:secrets:set GITHUB_DISPATCH_TOKEN
   ```

## 3. Admin user bootstrap

1. Firebase Console → **Authentication** → **Add user** (email + password). Disable public sign-up.
2. Copy the user's **UID**.
3. Seed the admin document:

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=./your-service-account.json

   ADMIN_UID=your-firebase-auth-uid ADMIN_EMAIL=you@example.com \
     node scripts/seed-admin.mjs
   ```

   `FIREBASE_SERVICE_ACCOUNT_JSON` also works if set to the **file path** or inline JSON — not just a bare filename unless you are in the repo root and the file exists there.

4. Optional: seed default CMS singletons:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./tradeinsolutions-6f0e9-firebase-adminsdk-fbsvc-8b933186b4.json node scripts/seed-cms-defaults.mjs
   ```

5. Sign in at `/admin/login/` after `npm run dev`.

## 4. CMS content

- Edit content in the admin panel at `/admin/`.
- Rich text fields use **Markdown**.
- Images upload to Firebase Storage via admin forms.
- After editing: **Publish content** (Firestore) then **Publish site** (triggers CI rebuild).

See [content-entry-checklist.md](./content-entry-checklist.md) for field-by-field guidance.

### Migrating from Sanity (one-time)

If you have existing Sanity content:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=056mgeru SANITY_API_READ_TOKEN=sk5UzlKizeWYMEReMFrrsMQE3lZaXD18FrCtxgCqVH4w4R3xL4XdITFO7bmDl3nhsAqVByNJQtP9BYpDXw2OqinVy35BIygASrM69vIZILLHAVYKGti41W9bitIm5xpQ9fgelGwKRZqPF1IBBjpqyavAwg3IJkstJbtlZnvA9IFXuA0NWLTN \
  FIREBASE_SERVICE_ACCOUNT_JSON='' \
  node scripts/migrate-sanity-to-firestore.mjs
```

Requires `@sanity/client` (dev dependency). Re-upload images in admin if needed.

## 5. Resend (email)

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Set `RESEND_FROM_EMAIL` to a verified address
4. Set `CONTACT_FORM_TO_EMAIL` to the inbox that receives leads

## 6. reCAPTCHA v3

1. Register site at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` to `.env.local`
3. Set `RECAPTCHA_SECRET_KEY` as a Firebase secret

## 7. Local development

```bash
npm run dev          # Next.js at :3000 (public site + /admin)
firebase emulators:start  # Hosting :5000, Functions :5001, Firestore :8080
```

Forms POST to `/api/contact`, `/api/appointment`, etc., rewritten to Cloud Functions when deployed or emulated.

## 8. Build and deploy

```bash
npm run build        # outputs to out/ (fetches published Firestore CMS)
firebase deploy      # hosting + functions + rules + storage
```

## 9. GitHub Actions secrets

| Secret                     | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT` | CI deploy + Firestore CMS fetch at build time |
| `NEXT_PUBLIC_FIREBASE_*`   | Firebase web config for admin static bundle   |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site URL                            |
| `GITHUB_DISPATCH_TOKEN`    | `cmsPublish` function triggers rebuild        |

Without `FIREBASE_SERVICE_ACCOUNT`, CI builds use **fallback defaults** from `lib/cms/defaults.ts`.

### CI service account IAM

Grant the CI service account: **Firebase Admin**, **Service Account User**, **Cloud Functions Admin**, **Secret Manager Admin**. See prior IAM notes in git history if deploy fails on `ActAs` or secrets.

## 10. Publish site workflow

1. Edit content in `/admin/` → **Publish content**
2. Click **Publish site** (calls `/api/cms-publish` with your ID token)
3. GitHub Actions runs `repository_dispatch` event `cms-publish` and rebuilds static site

## Notes

- **Static export**: public pages are built from published Firestore docs at build time.
- **Admin** is client-side only; protected by Firebase Auth + Firestore/Storage rules.
- **Partytown** copies worker files on build (`npm run partytown`).
