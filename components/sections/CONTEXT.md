# Context — components/sections

## Purpose

Reusable page sections mapped to site-outline-features.md (hero, process steps, testimonials, maps, etc.).

## Key files

- `HeroSection.tsx`: CMS-driven hero with image/video
- `BulletSection.tsx`, `ProcessSteps.tsx`, `StatsTrustBar.tsx`
- `TestimonialsSlider.tsx`, `BlogListing.tsx`, `FaqSearch.tsx`
- `GoogleMapEmbed.tsx`, `DocumentChecklist.tsx`, `CaseStudiesSection.tsx`

## Implemented

- [x] All major sections from site outline
- [x] Client components where interactivity required (slider, FAQ search, blog pagination)

## Remaining

- [ ] Service area map SVG (optional enhancement)

## Conventions

- Server pages fetch CMS data; pass props to sections
- Client sections suffixed or marked `"use client"`

## Notes

- Static sections (Quick Actions, Stats) remain hardcoded per spec
