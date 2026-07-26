# Context — components/shared

## Purpose

Cross-page shared components: navigation, footer, banners, analytics wrappers, CMS image helpers, and reusable framer-motion primitives.

## Key files

- `Nav.tsx`, `Footer.tsx`, `AnnouncementBar.tsx`, `CTABanner.tsx`: global chrome
- `motion.tsx`: reusable scroll-animation primitives (`Reveal`, `Stagger`, `StaggerItem`, `SectionEyebrow`)
- `CmsImage.tsx`: Firebase Storage image wrapper (with deprecated `SanityImage` alias)
- `Analytics.tsx`, `ScrollTracker.tsx`: GA4 tracking
- `ExitIntentPopup.tsx`, `LiveChat.tsx`, `RecaptchaScript.tsx`: conversion/infra widgets

## Implemented

- [x] Global layout chrome (nav, footer, banners)
- [x] Motion primitives with `useReducedMotion` support and viewport-once reveals

## Remaining

- [ ] None currently

## Conventions

- Motion primitives are the single source of animation variants — sections must import from `motion.tsx` instead of redefining stagger/reveal variants (hero-scale custom animations excepted)
- Client components marked `"use client"`; no direct firebase/db imports

## Notes

- `SectionEyebrow` gives consistent gold uppercase section labels across the homepage
