# Trade-In Solutions Irvine — Tech Stack (Firebase Hosting Edition)

> Next.js rebuild with heavy SEO optimization, headless CMS, and Claude Code-friendly deployment pipeline.
> **Hosting: Firebase** (updated from Vercel)
> Date: 2026-07-25

---

## 1. Frontend Framework

| Layer             | Choice                               | Rationale                                                                                           |
| ----------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Framework**     | **Next.js 15** (App Router)          | Static Site Generation (SSG) for SEO. We use `output: 'export'` for Firebase Hosting compatibility. |
| **Language**      | TypeScript                           | Type safety across the stack                                                                        |
| **Styling**       | Tailwind CSS v4                      | Utility-first, fast iteration, small bundle, design-system friendly                                 |
| **UI Components** | shadcn/ui + Radix primitives         | Accessible, customizable, no runtime CSS-in-JS overhead                                             |
| **Animation**     | Framer Motion                        | Page transitions, scroll reveals, micro-interactions                                                |
| **Icons**         | Lucide React                         | Consistent, lightweight SVG icons                                                                   |
| **Fonts**         | Inter (body) + optional display font | Fast Google Fonts loading with `next/font`                                                          |

---

## 2. Headless CMS

| Choice                     | **Sanity** (Free Tier)                                                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Is it free?**            | **YES — for this use case.** Sanity's free tier includes: 3 users, 10,000 API requests/day, 5GB assets, 1GB bandwidth. For a small local business site, this is more than enough. |
| **When would you pay?**    | If you need >3 editors, >10K daily API calls, or >5GB image storage. For Trade-In Solutions, the free tier should last years.                                                     |
| **Schema needs**           | Pages (Home, About, FAQ, Locations), Blog posts, Testimonials, Global settings (phones, addresses, social), Navigation menus, CTA banners                                         |
| **Sanity features to use** | Portable Text (rich content), image hotspot/crop, scheduled publishing, webhooks for cache revalidation, preview mode                                                             |

### Free Alternative (if you want zero vendor lock-in)

| Alternative        | **Keystatic**                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **What is it?**    | Git-based CMS that lives in your repo. Content is stored as Markdown/JSON files.                                     |
| **Cost**           | **100% free forever** — no API limits, no user limits                                                                |
| **Pros**           | No external service to manage; content lives in Git; Claude Code can edit content files directly; works offline      |
| **Cons**           | Non-technical editors need a GitHub account; not as polished as Sanity for rich media                                |
| **Best for**       | Teams comfortable with Git, or sites with simple content needs                                                       |
| **Recommendation** | Start with **Sanity (free tier)**. If you outgrow it or want to eliminate monthly costs, migrate to Keystatic later. |

---

## 3. SEO & Performance Stack

| Tool                                | Purpose                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| **Next.js Metadata API**            | Dynamic `<title>`, `<meta>`, Open Graph, Twitter Cards, canonical URLs, robots, sitemap |
| **next-sitemap**                    | Auto-generated `sitemap.xml` + `robots.txt`                                             |
| **Schema.org JSON-LD**              | LocalBusiness, Service, FAQPage, BlogPosting, Review structured data                    |
| **Sanity CDN images**               | Automatic WebP/AVIF, responsive srcset, lazy loading                                    |
| **Partytown**                       | Offload third-party scripts (GTM, chat widgets) to web worker                           |
| **Firebase Performance Monitoring** | Track Core Web Vitals and page load times                                               |

---

## 4. Forms & Lead Capture

| Tool                   | Purpose                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **React Hook Form**    | Lightweight form handling                                                                        |
| **Zod**                | Runtime schema validation (TypeScript-first)                                                     |
| **Firebase Functions** | Serverless form handlers (contact, appointment) — free tier: 2M invocations/month                |
| **Resend**             | Transactional emails (form submissions, appointment confirmations) — free tier: 3,000 emails/day |
| **Firebase Firestore** | Store form submissions as backup/CRM — free tier: 50K reads/day, 20K writes/day                  |

---

## 5. Deployment & Hosting (Firebase)

| Layer                  | Choice                         | Rationale                                                             |
| ---------------------- | ------------------------------ | --------------------------------------------------------------------- |
| **Static Hosting**     | **Firebase Hosting**           | Free SSL, global CDN, custom domain, atomic deploys, preview channels |
| **Serverless Backend** | **Firebase Functions** (Gen 2) | Handle form submissions, Sanity webhooks, email sending               |
| **Database**           | **Firebase Firestore**         | Store leads, form submissions, appointment data                       |
| **Domain**             | Cloudflare or Google Domains   | DNS management                                                        |
| **SSL**                | Auto (Firebase-managed)        | Free, auto-renewing Let's Encrypt                                     |

### Firebase Free Tier Limits (more than enough for this site)

| Service                | Free Allowance                                   |
| ---------------------- | ------------------------------------------------ |
| **Firebase Hosting**   | 10GB storage, 10GB/month transfer                |
| **Firebase Functions** | 2M invocations/month, 400K GB-seconds compute    |
| **Firestore**          | 50K reads/day, 20K writes/day, 1GB storage       |
| **Authentication**     | 50K users/month (if you add user accounts later) |

---

## 6. Claude Code → Production Pipeline (Firebase)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Claude     │────▶│   GitHub    │────▶│   GitHub    │────▶│  Firebase   │
│  Code (AI)  │     │   Repo      │     │   Actions   │     │   Hosting   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   Firebase  │
                       │   Functions │
                       └─────────────┘
```

### Setup Steps

1. **GitHub Repository**
   - Create `tradeinsolutions-irvine-next` repo
   - Add Firebase Service Account JSON as repo secret: `FIREBASE_SERVICE_ACCOUNT`
   - Add Sanity tokens as secrets: `SANITY_PROJECT_ID`, `SANITY_API_TOKEN`

2. **Firebase Project Setup**

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting,functions,firestore
   ```

   > Do **not** enable framework-aware hosting (`firebase experiments:enable webframeworks`). Use static export + `"public": "out"` instead.

3. **Next.js Config for Firebase**

   ```ts
   // next.config.ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "export",
     trailingSlash: true,
     images: {
       unoptimized: true,
     },
   };

   export default nextConfig;
   ```

   Build output goes to `out/` (Next.js default). Firebase Hosting serves this directory.

4. **GitHub Actions Workflow** (`.github/workflows/firebase-hosting-merge.yml`)

   ```yaml
   name: Deploy to Firebase
   on:
     push:
       branches: [main]
   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: "20"
         - run: npm ci
         - run: npm run build
         - uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: "${{ secrets.GITHUB_TOKEN }}"
             firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
             channelId: live
             projectId: tradeinsolutions-irvine
   ```

5. **Claude Code Commands** (example)

   ```bash
   # Claude makes changes, then:
   git add .
   git commit -m "feat: add FAQ accordion component"
   git push origin main
   # GitHub Actions auto-builds and deploys to Firebase
   ```

6. **Environment Variables** (stored in GitHub Secrets + Firebase Functions config)
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `SANITY_WEBHOOK_SECRET`
   - `RESEND_API_KEY`
   - `CONTACT_FORM_TO_EMAIL`

---

## 7. Development Tools

| Tool                        | Purpose                                                        |
| --------------------------- | -------------------------------------------------------------- |
| **ESLint** + **Prettier**   | Code quality & formatting                                      |
| **Husky** + **lint-staged** | Pre-commit hooks                                               |
| **Vitest**                  | Unit testing                                                   |
| **Playwright**              | E2E testing (critical flows: form submit, appointment booking) |

---

## 8. Third-Party Integrations

| Service                     | Purpose                       | Implementation               |
| --------------------------- | ----------------------------- | ---------------------------- |
| **Google Analytics 4**      | Traffic & conversion tracking | `next/script` with Partytown |
| **Google Tag Manager**      | Tag management                | Via GTM container            |
| **Google Business Profile** | Local SEO                     | Embed reviews, link to site  |
| **Yelp**                    | Social proof                  | Badge + link to profile      |
| **reCAPTCHA v3**            | Form spam protection          | Invisible, no user friction  |

---

## 9. Project Folder Structure

```
tradeinsolutions-irvine-next/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions → Firebase
├── app/                          # Next.js App Router
│   ├── (site)/                   # Route group for main site
│   │   ├── page.tsx              # Homepage
│   │   ├── about-us/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── schedule-appointment/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── branch-locations/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Individual blog post
│   │   ├── contact/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── layout.tsx            # Root layout (nav, footer, metadata)
│   │   └── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── sections/                 # Page sections (Hero, Features, etc.)
│   ├── forms/                    # Form components
│   └── shared/                   # Nav, Footer, CTABanner, etc.
├── lib/
│   ├── sanity/                   # Sanity client, queries, types
│   ├── firebase.ts               # Firebase config (Analytics, etc.)
│   ├── utils.ts                  # cn() and helpers
│   └── seo.ts                    # Metadata helpers
├── functions/                    # Firebase Functions (Gen 2)
│   ├── src/
│   │   ├── contactForm.ts        # Contact form handler
│   │   ├── appointmentForm.ts    # Appointment form handler
│   │   └── sanityRevalidate.ts   # Sanity webhook → cache bust
│   └── package.json
├── types/
│   └── index.ts                  # Shared TypeScript types
├── public/                       # Static assets
├── sanity.config.ts              # Sanity studio config
├── firebase.json                 # Firebase Hosting config
├── firestore.rules               # Firestore security rules
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 10. Firebase Configuration Files

### `firebase.json`

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "rewrites": [
      {
        "source": "/api/contact",
        "function": { "functionId": "contactForm", "region": "us-west1" }
      },
      {
        "source": "/api/appointment",
        "function": { "functionId": "appointmentForm", "region": "us-west1" }
      },
      {
        "source": "/api/revalidate",
        "function": { "functionId": "sanityRevalidate", "region": "us-west1" }
      }
    ]
  },
  "functions": [{ "source": "functions", "codebase": "default" }],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

> **Note:** Do not use `"source": "."` with `frameworksBackend` for this project. That enables SSR/functions auto-detection and requires Blaze billing. Static export + explicit function rewrites is the intended model.

### `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{leadId} {
      allow read: if false;  // Only server-side reads
      allow create: if request.resource.data.email is string
                     && request.resource.data.name is string;
    }
  }
}
```

---

## 11. Sanity Schema Overview

```typescript
// schemas/page.ts
// schemas/blogPost.ts
// schemas/testimonial.ts
// schemas/location.ts
// schemas/siteSettings.ts
// schemas/navigation.ts
// schemas/faqItem.ts
```

---

## 12. Key Dependencies

```json
{
  "dependencies": {
    "next": "^16.2.11",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "typescript": "^5.8.3",
    "tailwindcss": "^4.3.3",
    "@sanity/vision": "^3.72.1",
    "sanity": "^6.6.0",
    "next-sanity": "^13.2.1",
    "@portabletext/react": "^3.2.1",
    "framer-motion": "^12.42.2",
    "lucide-react": "^1.26.0",
    "react-hook-form": "^7.83.0",
    "zod": "^4.4.3",
    "firebase": "^12.16.0",
    "@qwik.dev/partytown": "^0.14.0",
    "next-themes": "^0.4.6"
  },
  "devDependencies": {
    "@playwright/test": "^1.62.0",
    "vitest": "^4.1.10",
    "eslint": "^9.28.0",
    "prettier": "^3.9.6",
    "husky": "^9.1.7",
    "lint-staged": "^17.2.0"
  }
}
```

### Static export constraints

- **Sanity Live Content / Draft Mode** are not compatible with `output: 'export'`. Use build-time fetching + Sanity webhook → GitHub Actions rebuild.
- **Sitemap:** use built-in `app/sitemap.ts` with `export const dynamic = 'force-static'` (not `next-sitemap` postbuild).
- **Partytown:** package renamed to `@qwik.dev/partytown`; App Router requires manual integration.
- **Forms:** no Next.js API routes or Server Actions; POST to Firebase Function endpoints via Hosting rewrites.

---

## 13. Firebase Functions (Serverless Backend)

Since we're using static export (`output: 'export'`), we need Firebase Functions for:

1. **Form Handling** (`/api/contact`, `/api/appointment`)
   - Validate with Zod
   - Send email via Resend
   - Store lead in Firestore
   - Return success/error response

2. **Sanity Webhook** (`/api/revalidate`)
   - Receive Sanity publish webhook
   - Trigger GitHub Actions rebuild (or just rebuild nightly via cron)

3. **reCAPTCHA Verification**
   - Verify token server-side before processing form

---

## 14. Migration Checklist

- [ ] Export all WordPress content (pages, posts, images, testimonials)
- [ ] Set up Firebase project & install CLI
- [ ] Set up Sanity project & schemas (or Keystatic if chosen)
- [ ] Import content into CMS
- [ ] Build Next.js site with `output: 'export'`
- [ ] Set up Firebase Functions for forms
- [ ] Configure GitHub Actions for CI/CD
- [ ] Implement 301 redirects from old WordPress URLs
- [ ] Configure custom domain in Firebase Hosting
- [ ] Set up Google Search Console
- [ ] Submit new sitemap
- [ ] Update Google Business Profile website link
- [ ] Test all forms and CTAs
- [ ] Launch & monitor

---

## 15. CMS Comparison: Sanity vs Keystatic

| Feature                   | Sanity (Free Tier)           | Keystatic (Free)                |
| ------------------------- | ---------------------------- | ------------------------------- |
| **Cost**                  | Free (3 users, 10K API/day)  | Free forever                    |
| **Hosting**               | Cloud (managed)              | Git-based (self-hosted)         |
| **Non-technical editors** | ✅ Excellent UI              | ⚠️ Requires GitHub login        |
| **Rich text**             | ✅ Portable Text (excellent) | ✅ Markdown                     |
| **Images**                | ✅ CDN + transforms          | ⚠️ Manual optimization          |
| **Real-time preview**     | ✅ Built-in                  | ⚠️ Via Next.js preview mode     |
| **API limits**            | 10K/day                      | Unlimited (Git-based)           |
| **Claude Code editing**   | Via API                      | Direct file editing             |
| **Setup complexity**      | Medium                       | Low                             |
| **Best for**              | Teams with non-dev editors   | Dev-heavy teams, simple content |

**Recommendation:** Use **Sanity (free tier)**. If you hit limits in 2-3 years, migrate to Keystatic. For now, Sanity gives your client the easiest editing experience.
