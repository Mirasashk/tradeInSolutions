# Context — components/sections

## Purpose

Reusable page sections mapped to site-outline-features.md (hero, process steps, testimonials, maps, etc.). Homepage-specific redesigned sections live in `home/`.

## Key files

- `home/`: redesigned homepage sections with framer-motion scroll animations (see `home/CONTEXT.md`)
- `PageHero.tsx`: compact navy hero for inner pages (about, faq, testimonials, contact, blog)
- `FinalCta.tsx`: closing conversion panel (home, about, testimonials, blog posts)
- `ProcessTimeline.tsx`: animated 3-step process (home, about)
- `TestimonialsGrid.tsx`: animated testimonial card grid (testimonials page)
- `FaqSearch.tsx`, `BlogListing.tsx`: redesigned with motion primitives
- `HeroSection.tsx`: legacy CMS hero (still used by schedule-appointment, value-estimator, beat-your-offer)
- `ProcessSteps.tsx`: legacy steps (still used by schedule-appointment)
- `GoogleMapEmbed.tsx`, `DocumentChecklist.tsx`, `CaseStudiesSection.tsx`
- `SocialProofTicker.tsx`, `TrustBadgesRow.tsx`, `YelpBadge.tsx`: shared with homepage
- `TrustBadgesRow.tsx`: card-grid trust badges with SectionEyebrow, stagger reveal, gold icon boxes; falls back to static defaults

## Implemented

- [x] All major sections from site outline
- [x] Client components where interactivity required (slider, FAQ search, blog pagination)
- [x] Homepage redesign with scroll animations (`home/`)

## Remaining

- [ ] Service area map SVG (optional enhancement)
- [ ] Migrate schedule-appointment, value-estimator, beat-your-offer to `PageHero`/`ProcessTimeline` and retire `HeroSection`/`ProcessSteps`

## Conventions

- Server pages fetch CMS data; pass props to sections
- Client sections suffixed or marked `"use client"`

## Notes

- Static sections (Quick Actions, Stats) remain hardcoded per spec
- `TestimonialsSlider.tsx`, `QuickActionsGrid.tsx`, `StatsTrustBar.tsx`, `BulletSection.tsx` were removed — replaced by redesigned `home/` sections
