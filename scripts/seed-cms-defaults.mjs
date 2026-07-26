#!/usr/bin/env node
/**
 * Seed default CMS singletons into Firestore (published).
 * Usage: node scripts/seed-cms-defaults.mjs
 */
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { initFirebaseAdmin } from "./lib/load-service-account.mjs";

const db = getFirestore(initFirebaseAdmin());
const meta = {
  status: "published",
  publishedAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
};

const defaultNavigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Appointments", href: "/schedule-appointment/" },
  { label: "Testimonials", href: "/testimonials/" },
  { label: "Locations", href: "/branch-locations/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

const singletons = {
  siteSettings: {
    phone: "(888) 427-2302",
    email: "info@tradeinsolutions-irvine.com",
    address: "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618",
    hours: "Mon–Sat 9am–6pm",
    announcementText: "FREE APPRAISALS — Call (888) 427-2302",
    ctaBannerText: "GOT QUESTIONS? CONTACT US AT (888) 427-2302",
    tagline: "We buy cars for cash — hassle free.",
    yelpUrl: "https://www.yelp.com",
    yelpRating: 5,
  },
  navigation: { items: defaultNavigation },
  homePage: {
    heroHeadline: "We Will Buy Your Car Today — Absolutely Hassle Free!",
    heroSubheadline:
      "Get a fair cash offer with a free appraisal. Same-day payment available.",
    heroPrimaryCtaLabel: "Get Your Free Appraisal",
    heroPrimaryCtaHref: "/schedule-appointment/",
    heroSecondaryCtaLabel: "Call (888) 427-2302",
    heroSecondaryCtaHref: "tel:8884272302",
    whySellHeadline: "Why Should I Sell My Car to Trade-In Solutions?",
    whySellBullets: [
      "Free appraisal with no obligation",
      "Same-day payment available",
      "28+ years of experience",
      "We buy all makes and models",
    ],
    compareHeadline: "Compare Other Offers to Trade-In Solutions",
    compareBullets: [
      "Free appraisal",
      "Expert appraisers",
      "Market trend analysis",
      "7-day offer guarantee",
      "Explained appraisal process",
      "Immediate check",
      "45-minute process",
    ],
  },
  aboutPage: {
    heroTitle: "About Trade-In Solutions",
    story: "We have helped Orange County drivers sell their cars for cash since 1996.",
    confidenceGuarantee: "Our offers are guaranteed for 7 days or 350 miles.",
  },
  appointmentPage: {
    heroTitle: "Schedule Your Free Appraisal",
    heroSubtitle: "Same-day payment available.",
    whyUsCards: [
      { title: "45 Mins or Less", description: "Quick in-and-out appraisal process." },
      {
        title: "7 Days or 350 Miles",
        description: "Your offer is guaranteed for 7 days.",
      },
      { title: "We Pay the Same Day", description: "Walk out with a check today." },
    ],
    checklistOwned: ["Title", "Registration", "Keys"],
    checklistFinanced: ["Payoff information", "Registration", "Keys"],
    checklistLeased: ["Lease contract", "Registration", "Keys"],
  },
  leadMagnet: {
    title: "Free Car Selling Guide",
    description: "Download our guide to getting the best offer for your vehicle.",
    downloadUrl: "/blog/",
  },
};

for (const [docId, data] of Object.entries(singletons)) {
  await db
    .collection("cmsSingletons")
    .doc(docId)
    .set({ ...data, ...meta }, { merge: true });
  console.log(`Seeded cmsSingletons/${docId}`);
}

console.log("Default CMS content seeded.");
