# Trade-In Solutions Irvine — Next.js Site

Static-export Next.js site for Trade-In Solutions Irvine, powered by Sanity CMS and deployed to Firebase Hosting with Cloud Functions for form handling.

## Stack

- **Next.js 16** (App Router, static export)
- **Sanity CMS** (content)
- **Firebase Hosting + Functions Gen 2** (hosting + forms)
- **Tailwind CSS v4 + shadcn/ui**
- **Vitest + Playwright** (testing)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Static export to `out/`  |
| `npm run test:run` | Run Vitest unit tests    |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint`     | Run ESLint               |

## Firebase

```bash
npm ci --prefix functions
firebase emulators:start
```

See [docs/setup-local.md](docs/setup-local.md) for full setup (Sanity, Blaze plan, Resend, reCAPTCHA, deploy).

## Sanity Studio

Embedded at `/studio` in development. Run `npx sanity dev` for standalone Studio editing.

## Deployment

Push to `main` triggers GitHub Actions to build and deploy to Firebase Hosting. Functions and Firestore rules deploy in the same workflow after hosting.
