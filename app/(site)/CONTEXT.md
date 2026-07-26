# Context — app/(site)

## Purpose

Public-facing site routes (App Router route group). Each page is a thin server component: fetches CMS data via `lib/cms/fetch`, builds SEO metadata via `lib/seo`, and renders section components.

## Key files

- `page.tsx`: redesigned homepage composed of `components/sections/home/*` (scroll-animated) plus shared sections (ticker, case studies, trust badges, Yelp)
- `layout.tsx`: site chrome (announcement bar, nav, footer, sticky CTA, exit-intent, LocalBusiness JSON-LD)
- `about-us/`, `faq/`, `schedule-appointment/`, `testimonials/`, `branch-locations/`, `blog/`, `contact/`, `privacy-policy/`: content pages
- `value-estimator/`, `beat-your-offer/`: lead-gen feature pages

## Implemented

- [x] All pages from site outline with unique metadata + canonical URLs
- [x] Homepage redesign: parallax hero, scroll reveals, animated stats, process timeline, testimonial showcase, final CTA
- [x] Inner-page redesign (about-us, faq, testimonials, contact, blog, blog/[slug]): shared `PageHero`, scroll reveals, card-based layouts, `FinalCta` panels
- [x] JSON-LD: LocalBusiness (layout), FAQPage, Review, BlogPosting on respective pages

## Remaining

- [ ] Redesign remaining pages (schedule-appointment, branch-locations, value-estimator, beat-your-offer, privacy-policy) with the same design system

## Conventions

- Pages stay thin: fetch data, build metadata, render sections — no business logic
- CMS content falls back to `lib/cms/defaults` values
- Trailing-slash internal links (`/schedule-appointment/`)

## Notes

- Homepage sections receive CMS props from the server page; animation happens client-side but content is server-rendered for SEO
