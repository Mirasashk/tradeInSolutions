# Context — scripts/data

## Purpose

Seed content datasets for `scripts/seed-cms-content.mjs`, mirroring the original WordPress site (tradeinsolutions-irvine.com). Pure data modules — no IO.

## Key files

- seed-blog-posts.mjs: 10 blog posts with full Markdown bodies, categories, dates, and main images.
- seed-testimonials.mjs: 28 customer testimonials (6 homepage-slider + 22 from the testimonials page) with staggered `publishedAt` dates for ordering.
- seed-faq-items.mjs: 12 FAQ items; the "beat another dealer's offer" item carries `anchorId: "compare-offers"` for the homepage deep link.
- seed-site-content.mjs: singletons (siteSettings, navigation, homePage, aboutPage, appointmentPage, leadMagnet), 3 locations, team members, trust badges, social proof items, and static pages (privacy-policy + info pages).
- seed-info-pages.mjs: 4 informational pages (how-it-works, what-to-bring-for-the-sale, previous-offers, how-do-we-value-your-car) migrated from the legacy WordPress site.

## Implemented

- [x] All CMS schemas covered with real site content
- [x] Image references as `{ file, alt }` markers resolved against `/assets` by the seed script

## Remaining

- [ ] Case studies (require real customer data + permission; collection intentionally left empty)
- [ ] Team member photo for Adel Moini (no staff photo exists in /assets)

## Conventions

- Image fields use `{ file: "<name in /assets>", alt: "<alt text>" }`; the orchestrator uploads and replaces them with `CmsImage` objects.
- `publishedAt` is a date string (`YYYY-MM-DD`); the orchestrator anchors it to midday.
- Collection entries may include a `key` used as the Firestore doc ID on first creation.
- `seoTitle` values must NOT include the "| Trade-In Solutions Irvine" suffix — the layout template appends it.

## Notes

- Blog bodies were fetched from the live WordPress posts and lightly copy-edited; the closing appraisal CTA is shared via a constant.
- Newest testimonial dates are given to the six quotes that appeared on the old homepage slider so they surface on the landing page (top 6 by date).
