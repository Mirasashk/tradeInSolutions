# Local Setup Guide

Step-by-step setup for the Trade-In Solutions Irvine Next.js site.

## Prerequisites

- Node.js 22+
- npm
- Firebase CLI (`npm i -g firebase-tools`)
- Sanity account (free tier)
- Firebase project on **Blaze plan** (required for Functions outbound calls to Resend/reCAPTCHA)

## 1. Clone and install

```bash
git clone git@github.com:Mirasashk/tradeInSolutions.git
cd tradeInSolutions
cp .env.example .env.local
npm install
npm ci --prefix functions
```

## 2. Sanity CMS

1. Create a project at [sanity.io/manage](https://sanity.io/manage)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=your-read-token
   ```
3. Add your local origin to Sanity CORS origins (`http://localhost:3000`)
4. Run Studio: `npx sanity dev` or visit `/studio` in dev mode
5. Create content for: Site Settings, Navigation, FAQ items, Testimonials, Locations, Blog posts

## 3. Firebase

1. Create project `tradeinsolutions-irvine` (or update `.firebaserc`)
2. Enable Firestore and upgrade to Blaze plan
3. Register a Web App and copy config to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=

   ```
4. Set Functions secrets:
   ```bash
   firebase functions:secrets:set RESEND_API_KEY
   firebase functions:secrets:set RESEND_FROM_EMAIL
   firebase functions:secrets:set CONTACT_FORM_TO_EMAIL
   firebase functions:secrets:set RECAPTCHA_SECRET_KEY
   firebase functions:secrets:set SANITY_WEBHOOK_SECRET
   firebase functions:secrets:set GITHUB_DISPATCH_TOKEN
   ```

## 4. Resend (email)

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Set `RESEND_FROM_EMAIL` to a verified address (e.g. `Trade-In Solutions <noreply@yourdomain.com>`)
4. Set `CONTACT_FORM_TO_EMAIL` to the inbox that receives leads

## 5. reCAPTCHA v3

1. Register site at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` to `.env.local`
3. Set `RECAPTCHA_SECRET_KEY` as a Firebase secret

## 6. Local development

```bash
npm run dev          # Next.js at :3000
firebase emulators:start  # Hosting :5000, Functions :5001, Firestore :8080
```

Forms POST to `/api/contact` and `/api/appointment`, rewritten to Cloud Functions when deployed or emulated.

## 7. Build and deploy

```bash
npm run build        # outputs to out/
firebase deploy      # hosting + functions + rules
```

## 8. GitHub Actions secrets

Add these in GitHub → **Settings** → **Secrets and variables** → **Actions** → **Repository secrets**:

| Secret                          | Value (from your local setup)                               |
| ------------------------------- | ----------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT`      | Firebase service account JSON                               |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Same as in `.env` (e.g. `056mgeru`)                         |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`                                                |
| `SANITY_API_READ_TOKEN`         | Sanity Viewer API token                                     |
| `NEXT_PUBLIC_SITE_URL`          | `https://tradeinsolutions-6f0e9.web.app` (or custom domain) |

Without the Sanity secrets, CI still builds but uses **fallback content** (no CMS data). Add the secrets so production deploys include Sanity content and webhook rebuilds fetch fresh data.

## 9. Sanity webhook → rebuild

In Sanity project settings, add a webhook:

- URL: `https://your-domain.com/api/revalidate`
- Header: `sanity-webhook-signature: <SANITY_WEBHOOK_SECRET>`
- Trigger on publish

This calls the `sanityRevalidate` function, which dispatches a GitHub `repository_dispatch` event to rebuild the static site.

## Notes

- **Static export** means no Draft Mode or Sanity Live Content. Content updates require a rebuild (via webhook CI).
- **Sanity Studio** at `/studio` works in dev; for production CMS access, prefer `sanity deploy` or run Studio separately.
- **Partytown** copies worker files on build (`npm run partytown`). Analytics scripts are env-gated.
