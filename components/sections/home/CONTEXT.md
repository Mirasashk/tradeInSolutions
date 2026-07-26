# Context — components/sections/home

## Purpose

Redesigned homepage-only sections with framer-motion scroll animations. These are client components that receive CMS data as props from `app/(site)/page.tsx`.

## Key files

- `HomeHero.tsx`: full-height hero with parallax background, staggered entrance, trust chips, scroll cue
- `QuickActions.tsx`: 5 action cards (how-it-works, previous-offers, value estimator, what-to-bring, how-we-value) with stagger reveal and hover lift
- `WhySellSection.tsx`: "Why sell" bullets + numbered "Compare offers" card (anchor `#compare-offers`)
- `StatsCounters.tsx`: animated count-up stats band (28+ years, 45 min, 7 days, 1000s)
- `TestimonialsShowcase.tsx`: auto-rotating testimonial slider with AnimatePresence, dots, arrows

## Implemented

- [x] All homepage sections from site outline redesigned with scroll animations
- [x] `useReducedMotion` respected in every animated component
- [x] Analytics tracking on all CTAs (`trackCtaClick`, `trackPhoneClick`)

## Remaining

- [ ] Optional: adopt motion primitives on inner pages (about, appointment)

## Conventions

- All components are `"use client"`; server page fetches CMS data and passes props
- Shared animation primitives come from `components/shared/motion.tsx` — do not duplicate variants here
- Static copy (steps, stats, quick actions) hardcoded per spec; CMS-driven copy passed as props

## Notes

- Shared sections still used by other pages (`YelpBadge`, `TrustBadgesRow`, `SocialProofTicker`, `CaseStudiesSection`) remain in `components/sections/`
- `FinalCta.tsx` and `ProcessTimeline.tsx` were promoted to `components/sections/` once inner pages started using them
