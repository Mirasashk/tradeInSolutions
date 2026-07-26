# Content Entry Checklist — Firebase Admin

Manual guide for editors using `/admin/`. After each batch: **Publish content**, then **Publish site** to rebuild production.

> **Note:** all of this content can be seeded automatically from the original site with `npm run seed:cms` (see [setup-local.md](./setup-local.md)). Use this checklist when entering or revising content by hand.

Sign in: `/admin/login/`

---

## 1. Site Settings

**Admin:** `/admin/content/site-settings/`

| Field            | Suggested value                                           |
| ---------------- | --------------------------------------------------------- |
| phone            | (888) 427-2302                                            |
| email            | info@tradeinsolutions-irvine.com                          |
| address          | 9891 Irvine Center Drive, Suite 200, Irvine, CA 92618     |
| hours            | Mon–Sat 9am–6pm                                           |
| announcementText | FREE APPRAISALS — Call (888) 427-2302                     |
| ctaBannerText    | GOT QUESTIONS? CONTACT US AT (888) 427-2302               |
| tagline          | We buy cars for cash — hassle free.                       |
| logo             | Upload brand logo (navbar — dark text OK on light header) |
| footerLogo       | Optional light/white logo variant for dark footer         |
| defaultOgImage   | 1200×630 social share image                               |
| yelpUrl          | Your Yelp business URL                                    |
| yelpRating       | 5                                                         |

---

## 2. Navigation

**Admin:** `/admin/content/navigation/`

Add 8 items:

| Label        | href                   |
| ------------ | ---------------------- |
| Home         | /                      |
| About Us     | /about-us/             |
| FAQ          | /faq/                  |
| Appointments | /schedule-appointment/ |
| Testimonials | /testimonials/         |
| Locations    | /branch-locations/     |
| Blog         | /blog/                 |
| Contact      | /contact/              |

---

## 3. Home Page

**Admin:** `/admin/content/home/`

- Hero headline, subheadline, hero image
- Primary CTA → `/schedule-appointment/`
- Secondary CTA → `tel:8884272302`
- Why Sell bullets (4+)
- Compare Offers bullets (7 from site outline)
- Optional video URL (YouTube/Vimeo)
- Social proof ticker lines (optional)

---

## 4. About Page

**Admin:** `/admin/content/about/`

- Hero title
- Our Story (Markdown)
- Confidence Guarantee (Markdown)

Team members: `/admin/content/team/`  
Trust badges: `/admin/content/trust-badges/`

---

## 5. Appointment Page

**Admin:** `/admin/content/appointment/`

- Hero title and subtitle
- Why Us cards (6)
- Document checklists (owned, financed, leased)

---

## 6. Blog (~10 posts)

**Admin:** `/admin/content/blog/`

Each post: title, slug, excerpt, author, category, published date, main image, Markdown body, SEO fields.

---

## 7. Testimonials (~28)

**Admin:** `/admin/content/testimonials/`

Name, location, car model, quote, rating, optional video URL.

---

## 8. Locations

**Admin:** `/admin/content/locations/`

Name, address, phones, hours, map embed URL, photo, directions (Markdown).

---

## 9. FAQ

**Admin:** `/admin/content/faq/`

Question, answer (Markdown), order, anchor ID.

---

## 10. Pages

**Admin:** `/admin/content/pages/`

| Slug                         | Route                          |
| ---------------------------- | ------------------------------ |
| `privacy-policy`             | `/privacy-policy/`             |
| `how-it-works`               | `/how-it-works/`               |
| `what-to-bring-for-the-sale` | `/what-to-bring-for-the-sale/` |
| `previous-offers`            | `/previous-offers/`            |
| `how-do-we-value-your-car`   | `/how-do-we-value-your-car/`   |

Each page: title, slug, SEO fields, Markdown body. Seeded via `npm run seed:cms` from `scripts/data/seed-info-pages.mjs`.

---

## 11. Marketing

**Admin:** `/admin/content/marketing/`

- Lead magnet (title, description, download URL)
- Case studies (with customer permission)
- Social proof ticker items

---

## Publish workflow

1. **Save draft** — work in progress, not on live site
2. **Publish content** — marks document `published` in Firestore
3. **Publish site** — triggers GitHub Actions to rebuild static site from published content

Leads from forms appear in `/admin/leads/` (read-only; submissions still go through Cloud Functions).
