# Trade-In Solutions Irvine — Site Outline & Feature Specification

> Complete breakdown of all pages, sections, content, and features for the Next.js rebuild.
> Based on audit of https://tradeinsolutions-irvine.com/ (WordPress site)
> Date: 2026-07-25

---

## Executive Summary

**Business:** Trade-In Solutions Irvine  
**What they do:** Buy cars for cash — free appraisal, same-day payment, hassle-free process  
**Target audience:** Car owners in Orange County, Los Angeles, and San Diego areas looking to sell their vehicle quickly and fairly  
**Primary goal:** Generate leads (appointment bookings, phone calls, form submissions)  
**Secondary goal:** Build trust through testimonials, blog content, and transparent process info

**Current site issues:**

- Built on WordPress — hard to customize, slow, poor mobile experience
- Outdated design and imagery
- No clear conversion funnel
- Blog content is old (last posts from ~2020)
- Contact form is basic, no validation
- No structured data for SEO
- No appointment scheduling integration
- Locations/directions are text-only, no embedded map

---

## Site Map

```
/
├── /about-us
├── /faq
├── /schedule-appointment
├── /testimonials
├── /branch-locations
├── /blog
│   ├── /blog/page/2
│   └── /blog/[slug]          (individual posts)
├── /contact
└── /privacy-policy           (split from About Us)
```

---

## Page-by-Page Breakdown

---

### 1. Homepage (`/`)

**SEO Target:** "sell my car irvine", "cash for cars orange county", "car buyers irvine ca"

#### Sections (top to bottom):

| #   | Section                 | Content                                                                                                                                                                                                                                                                     | CMS-Driven?         |
| --- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1   | **Announcement Bar**    | "FREE APPRAISALS — Call (888) 427-2302"                                                                                                                                                                                                                                     | ✅ Global setting   |
| 2   | **Hero**                | Headline: "We Will Buy Your Car Today — Absolutely Hassle Free!"<br>Subheadline about fair offers<br>CTA: "Get Your Free Appraisal" (→ /schedule-appointment)<br>Secondary CTA: "Call (888) 427-2302" (tel: link)<br>Background: High-quality image of happy customer + car | ✅                  |
| 3   | **Quick Actions Grid**  | 4 icon cards:<br>• How It Works → /about-us<br>• Got Previous Offers? → /faq#compare-offers<br>• Value My Car → /schedule-appointment<br>• Schedule Appointment → /schedule-appointment                                                                                     | ❌ Static           |
| 4   | **Why Sell to Us**      | Headline: "Why Should I Sell My Car to Trade-In Solutions?"<br>Bullet points highlighting key differentiators                                                                                                                                                               | ✅                  |
| 5   | **Compare Offers**      | Headline: "Compare Other Offers to Trade-In Solutions"<br>7 bullet points (free appraisal, experts, market trends, 7-day offer, explained appraisal, immediate check, 45-min process)                                                                                       | ✅                  |
| 6   | **Stats/Trust Bar**     | "28+ Years Experience" • "Thousands of Happy Customers" • "Same-Day Payment" • "45-Min Process"                                                                                                                                                                             | ❌ Static           |
| 7   | **Process Steps**       | Visual 3-step:<br>1. Make an Appointment<br>2. Inspection & Appraisal<br>3. Get a Check                                                                                                                                                                                     | ❌ Static           |
| 8   | **Testimonials Slider** | 6 rotating testimonials with name, location, car model<br>Link to full /testimonials page                                                                                                                                                                                   | ✅ (pulls from CMS) |
| 9   | **CTA Banner**          | Dark blue bar: "GOT QUESTIONS? CONTACT US AT (888) 427-2302"<br>Sticky on scroll (optional)                                                                                                                                                                                 | ✅ Global setting   |
| 10  | **Yelp Badge**          | "People Love Us on Yelp" with rating                                                                                                                                                                                                                                        | ❌ Static           |
| 11  | **Footer**              | Logo, address, phone, email, hours, quick links, social icons, privacy policy link                                                                                                                                                                                          | ✅ Global setting   |

---

### 2. About Us (`/about-us`)

**SEO Target:** "about trade in solutions irvine", "sell car irvine company"

#### Sections:

| #   | Section                  | Content                                                                                                                  | CMS-Driven? |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | **Hero**                 | "About Trade-In Solutions Irvine"                                                                                        | ❌          |
| 2   | **Our Story**            | 28+ years experience narrative<br>Founders' story about dealer frustration<br>"We listened to what consumers had to say" | ✅          |
| 3   | **3-Step Process**       | Visual cards:<br>1. Make an appointment<br>2. Have an inspection and appraisal<br>3. Get a check                         | ❌ Static   |
| 4   | **Confidence Guarantee** | "So confident... go to a traditional dealer first, get a written offer, then bring it to us"                             | ✅          |
| 5   | **CTA**                  | "Don't wait — call today to make an appointment"                                                                         | ❌          |
| 6   | **Team/Appraisers**      | _(NEW)_ Photos and bios of key staff (Adel Moini, etc.)                                                                  | ✅ NEW      |

**NOTE:** Current site has Privacy Policy embedded here. **Recommendation:** Split Privacy Policy to its own `/privacy-policy` page and link from footer.

---

### 3. FAQ (`/faq`)

**SEO Target:** "how to sell my car irvine", "sell financed car california", "sell leased car orange county"

**Schema:** FAQPage structured data for rich snippets

#### Questions (all CMS-driven, expandable accordion):

1. Do I need to schedule an appointment for an appraisal?
2. Have you heard of Autotrader.com trade in marketplace?
3. How can I get a quick estimate of my vehicle's value?
4. What if my car is leased?
5. What if my car is financed?
6. Are you only interested in popular/newer cars?
7. Do I need to contact DMV for information prior to my appointment?
8. Is it better to sell my car myself?
9. Is it better to do repairs before coming in?
10. How is TIS a truly stress-free alternative?
11. Do I need to bring my car in or can it be done over the phone?
12. Can you beat other dealer offers? _(NEW — based on current content)_

**Each answer:** Rich text with links to /schedule-appointment where relevant.

---

### 4. Schedule Appointment (`/schedule-appointment`)

**SEO Target:** "schedule car appraisal irvine", "sell my car appointment orange county"

**This is the PRIMARY conversion page.**

#### Sections:

| #   | Section               | Content                                                                                                                                                                                                                                                                                                                                                                                             | CMS-Driven? |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | **Hero**              | "Selling Your Vehicle? Experience a Hassle-Free way to get the highest value!"<br>"We Will Buy Your Car Today"                                                                                                                                                                                                                                                                                      | ❌          |
| 2   | **3-Step Process**    | Same as homepage but larger                                                                                                                                                                                                                                                                                                                                                                         | ❌          |
| 3   | **Appointment Form**  | _(CRITICAL)_<br>Fields:<br>• Name (required)<br>• Phone (required)<br>• Email (required)<br>• Preferred Date<br>• Preferred Time<br>• Vehicle Year/Make/Model<br>• Vehicle Mileage<br>• Brief Condition Description<br>• Upload photos (optional, 3-5 max)<br>• "I have a previous offer" checkbox<br>• reCAPTCHA v3<br>Submit → Email to info@tradeinsolutions-irvine.com + auto-reply to customer | ❌          |
| 4   | **Why Us Grid**       | 6 benefit cards:<br>• 45 Mins or Less<br>• 7 Days or 350 Miles<br>• We Pay the Same Day<br>• Fair Offers<br>• We Are Experts<br>• We Take Care of Everything                                                                                                                                                                                                                                        | ✅          |
| 5   | **Yelp Badge**        | Social proof                                                                                                                                                                                                                                                                                                                                                                                        | ❌          |
| 6   | **Locations Sidebar** | Quick links to /branch-locations                                                                                                                                                                                                                                                                                                                                                                    | ❌          |

**NEW FEATURE — Appointment Scheduling Integration:**

- Option A: Embed Calendly/Acuity for self-service booking
- Option B: Form-only (current behavior) with phone follow-up
- **Recommendation:** Start with enhanced form, add Calendly later

---

### 5. Testimonials (`/testimonials`)

**SEO Target:** "trade in solutions reviews", "sell car irvine reviews"

**Schema:** Review structured data (aggregateRating + individual reviews)

#### Content:

- Yelp badge at top
- Grid/list of all testimonials
- Each testimonial card:
  - Quote text
  - Customer name
  - Location
  - Car model
  - Star rating (if available)
  - Date (if available)

**Current testimonials to migrate (~25+):**
K. Mizban (Beverly Hills, Lincoln Town Car), Jake Levonthal (Los Angeles, Saab 9/5), Farhad M. (West Hollywood, Honda Civic), J. Tisdale (Irvine, Suzuki Esteem), S. Cornell (Irvine, VW Golf), E. Kang (Irvine, Audi A8), Maria A. (Huntington Beach, VW Jetta), Bahareh P. (Newport Beach, VW Beetle), Leonard K. (South Pasadena, Lexus GS350), Everette P. (Newport Beach, Honda Pilot), Jamal Y. (Laguna Hills, Toyota Touareg), Shannon P. (Rancho Santa Margarita, Jeep Wrangler), Morbani M. (Orange, Jeep Cherokee), Joshua N. (Irvine, Toyota Tundra), Froilan B. (Irvine, Nissan 350Z), Judy O. (Los Angeles, Ford Expedition), Chris S. (Fullerton, Audi R8), Depak P. (San Clemente, MBZ G500), Gil B. (Costa Mesa, Hyundai Accent), Jacklyn A. (San Diego, BMW 325i), Kaitte H. (Mission Viejo, Hyundai Tucson), Kaliraj G. (Irvine, Hyundai Santa Fe), Reagan G. (Ontario, MBZ C300), Kaveh S. (Dana Point, BMW 330ci), Charlie L. (Tustin, BMW 325i), Chris W. (Irvine, Nissan Armada), Julie P. (Irvine, BMW 128i), Cesar L. (Norwalk, VW GTI)

---

### 6. Branch Locations (`/branch-locations`)

**SEO Target:** "car buyers irvine", "sell car west los angeles", "trade in solutions location"

**Schema:** LocalBusiness + multiple location markup

#### Locations:

**Irvine / Orange County (Main)**

- 9891 Irvine Center Drive, Suite 200, Irvine, CA 92618
- Phones: (888) 427-2302, (949) 398-8232
- Embedded Google Map
- Driving directions (from 405 South and 5 North)
- Photo of building exterior
- "Schedule an Appointment" CTA

**West Los Angeles (Field Appraisal Only)**

- 11400 W. Olympic Blvd., Suite 650, West Los Angeles, CA 90064
- Embedded Google Map
- Photo of building
- Note: "Field Appraisal Only — Our appraiser will come to you!"

**San Diego / Murrieta** _(mentioned in nav but no details on current site)_

- Need to confirm with client if still active
- If active: Add location details

---

### 7. Blog (`/blog` + `/blog/[slug]`)

**SEO Target:** Long-tail keywords around car selling, maintenance, market trends

#### Blog Listing Page (`/blog`):

- Grid of blog post cards
- Each card: Featured image, title, excerpt, date, category
- Pagination (page 2, 3, etc.)
- Category filter (optional)

#### Individual Blog Post (`/blog/[slug]`):

- Rich text content (Portable Text)
- Featured image
- Author (if applicable)
- Published date
- Related posts
- CTA: "Ready to sell your car? Schedule an appointment"

#### Current posts to migrate:

1. Reduce Your Fuel Consumption (Nov 12)
2. Dealing With Car Corrosion (Oct 22)
3. Hybrid, Plug-in Hybrid, or Fully Electric Car? (Oct 8)
4. How Does Instant Offer Process Work? (Sep 17)
5. What is a Salvage Title Car and How to Sell It? (Aug 27)
6. Selling a Used Car: Private Buyer or Dealer? (Aug 20)
7. How to Prepare for a Recession? Or the Future of Used-Car Market (Aug 6)
8. How to Detect Car's Air Conditioner Problems (Jul 30)
9. How to Take Care of Car Battery (Jul 23)
10. How to Check Your Car Tires (Jul 18)

_(Note: These are old. Client should plan new content strategy.)_

---

### 8. Contact (`/contact`)

**SEO Target:** "contact trade in solutions irvine"

#### Sections:

| #   | Section          | Content                                 |
| --- | ---------------- | --------------------------------------- |
| 1   | **Hero**         | "Get In Touch"                          |
| 2   | **Contact Form** | Name, Email, Phone, Message + reCAPTCHA |
| 3   | **Contact Info** | Address, phone, email, hours            |
| 4   | **Map Embed**    | Google Map of Irvine location           |
| 5   | **Quick Links**  | Links to FAQ, Appointments, Locations   |

---

### 9. Privacy Policy (`/privacy-policy`) _(NEW — split from About Us)_

**Content:**

- Information Collection
- Data Collection Purpose
- Data Collection Methods
- Opt-Out Option
- Third-Party Data Sharing
- Data Retention
- Contact: info@tradeinsolutions-irvine.com
- Effective Date: Dec 15, 2023 (update on launch)

---

## Global Components (appear on all/most pages)

### Navigation

- Logo (left)
- Links: Home, About Us, FAQ, Appointments, Testimonials, Locations, Blog, Contact
- Phone number (click-to-call): (888) 427-2302
- CTA Button: "Get a Free Appraisal" → /schedule-appointment
- Mobile: Hamburger menu

### Footer

- Logo + tagline
- Address & contact info
- Quick links
- Social icons (Yelp, Google, Facebook if applicable)
- Privacy Policy link
- Copyright: © 2026 Trade-In Solutions Irvine

### Sticky CTA Banner (optional)

- Appears after scrolling past hero
- "GOT QUESTIONS? CONTACT US AT (888) 427-2302"
- Dark blue background, gold/yellow text

---

## Feature Specification

### Phase 1: Core (Must-Have for Launch)

| Feature                | Priority | Description                                        |
| ---------------------- | -------- | -------------------------------------------------- |
| Static page generation | P0       | All pages pre-rendered at build time for SEO       |
| Responsive design      | P0       | Mobile-first, works on all devices                 |
| Contact form           | P0       | Name, email, phone, message → email notification   |
| Appointment form       | P0       | Enhanced form with vehicle details                 |
| Google Maps embed      | P0       | On locations and contact pages                     |
| Schema.org markup      | P0       | LocalBusiness, Service, FAQPage, Review            |
| 301 redirects          | P0       | From old WordPress URLs to new Next.js URLs        |
| Meta tags & Open Graph | P0       | Every page has unique title, description, OG image |
| Sitemap.xml            | P0       | Auto-generated                                     |
| reCAPTCHA v3           | P0       | Spam protection on all forms                       |

### Phase 2: Conversion Optimization (Post-Launch)

| Feature                 | Priority | Description                                                 |
| ----------------------- | -------- | ----------------------------------------------------------- |
| Live chat widget        | P1       | Intercom, Tidio, or similar                                 |
| Calendly integration    | P1       | Self-service appointment booking                            |
| SMS notifications       | P1       | Auto-SMS on form submission                                 |
| A/B testing             | P1       | Vercel Edge Config or Optimizely                            |
| Exit-intent popup       | P1       | "Wait! Get a free appraisal before you go"                  |
| Vehicle photo upload    | P1       | In appointment form                                         |
| Instant offer estimator | P2       | Basic calculator (year, make, model, mileage → rough range) |
| Retargeting pixels      | P2       | Facebook Pixel, Google Ads                                  |

### Phase 3: Content & Growth

| Feature                  | Priority | Description                                |
| ------------------------ | -------- | ------------------------------------------ |
| Blog content calendar    | P2       | 2-4 posts/month for SEO                    |
| Video testimonials       | P2       | Embed YouTube testimonials                 |
| FAQ expansion            | P2       | Add more questions based on customer calls |
| Multi-language (Spanish) | P3       | Spanish version of key pages               |
| Reviews aggregation      | P3       | Pull Yelp/Google reviews via API           |

---

## Recommended NEW Features (Not on Current Site)

These are features that would significantly improve lead generation and user experience:

### 1. **Instant Vehicle Value Estimator** ⭐ HIGH IMPACT

- Simple form: Year, Make, Model, Mileage, Condition
- Returns a rough estimate range ("$8,500 – $11,200")
- Captures lead info before showing estimate
- Major SEO draw — "what's my car worth irvine"

### 2. **"We Beat Your Offer" Feature** ⭐ HIGH IMPACT

- Upload competitor offer (photo or text)
- Form to submit for review
- Promise: "We'll beat any written offer or give you $100"
- Directly addresses their current competitive messaging

### 3. **Live Chat / AI Chatbot**

- Answer common questions 24/7
- Qualify leads before human handoff
- "What documents do I need?" "How long does it take?"

### 4. **Video Hero Section**

- 30-60 second video showing the appraisal process
- Happy customers, actual location footage
- Builds trust immediately

### 5. **Before/After Case Studies**

- "Customer brought a dealer offer of $X, we paid $Y"
- Real examples (with permission)
- Powerful social proof

### 6. **Document Checklist Widget**

- Interactive: "What to bring to your appointment"
- Checklist based on situation (owned, financed, leased)
- Reduces friction/anxiety

### 7. **Service Area Map**

- Visual map showing service radius
- "We serve all of Orange County, Los Angeles, and San Diego"
- City-specific landing pages for SEO

### 8. **Trust Badges Section**

- BBB Accredited (if applicable)
- Licensed & Bonded
- 28+ Years in Business
- Yelp 5-Star Rating
- Google 5-Star Rating

### 9. **FAQ Chat Interface**

- Instead of accordion, a searchable FAQ
- "Ask a question..." autocomplete
- Better UX for mobile

### 10. **Appointment Reminder System**

- Automated email/SMS 24h before appointment
- "Here's what to bring" reminder
- Reduces no-shows

### 11. **Blog → Lead Magnet**

- "Download our free guide: 'How to Get the Most Money for Your Car'"
- Email capture for nurture sequence

### 12. **Social Proof Ticker**

- Marquee of recent sales: "Just bought a 2019 BMW X5 in Irvine for $32,500"
- Creates urgency and FOMO

---

## URL Redirect Map (WordPress → Next.js)

| Old WordPress URL             | New Next.js URL         |
| ----------------------------- | ----------------------- |
| `/`                           | `/`                     |
| `/about-us/`                  | `/about-us`             |
| `/faq/`                       | `/faq`                  |
| `/schedule-appointment/`      | `/schedule-appointment` |
| `/testimonials/`              | `/testimonials`         |
| `/branch-locations/`          | `/branch-locations`     |
| `/blog/`                      | `/blog`                 |
| `/blog/page/2/`               | `/blog?page=2`          |
| `/blog/[post-slug]/`          | `/blog/[slug]`          |
| `/contact/`                   | `/contact`              |
| `/contact-2/`                 | `/contact` (merge)      |
| `/privacy-policy/` (embedded) | `/privacy-policy` (new) |

---

## Content Migration Inventory

| Content Type     | Source                 | Destination                | Quantity |
| ---------------- | ---------------------- | -------------------------- | -------- |
| Pages            | WordPress pages        | Sanity pages               | 8        |
| Blog posts       | WordPress posts        | Sanity blog posts          | ~20+     |
| Testimonials     | WordPress testimonials | Sanity testimonials        | ~28      |
| Images           | WordPress media        | Sanity assets / Cloudinary | ~50      |
| Navigation menus | WordPress menus        | Sanity navigation          | 1        |
| Site settings    | WordPress customizer   | Sanity site settings       | 1        |

---

## Analytics & Tracking Events

| Event                 | Trigger                      | Platform         |
| --------------------- | ---------------------------- | ---------------- |
| page_view             | Every page load              | GA4              |
| click_phone           | Click phone number           | GA4 + GTM        |
| click_address         | Click address/directions     | GA4              |
| form_start            | Focus on any form field      | GA4              |
| form_submit           | Successful form submission   | GA4 + GTM        |
| appointment_booked    | Appointment form submitted   | GA4 (conversion) |
| cta_click             | Click any primary CTA button | GA4              |
| scroll_50 / scroll_90 | Scroll depth                 | GA4              |
| outbound_click        | Click to Yelp/Google         | GA4              |

---

## Design Direction Notes

- **Color palette:** Keep navy blue + gold/yellow accent (brand recognition)
- **Typography:** Clean, modern sans-serif (Inter or similar)
- **Imagery:** Real photos of the Irvine location, actual staff, real customers (with permission)
- **Tone:** Professional, trustworthy, friendly, stress-free
- **Mobile:** Phone number always tappable, forms thumb-friendly, click-to-call prominent
