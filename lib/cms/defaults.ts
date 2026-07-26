import type {
  AboutPageContent,
  AppointmentPageContent,
  HomePageContent,
  NavItem,
  SiteSettings,
} from "@/types";

export const defaultSiteSettings: SiteSettings = {
  phone: "(888) 427-2302",
  email: "info@tradeinsolutions-irvine.com",
  address: "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618",
  hours: "Mon–Sat 9am–6pm",
  announcementText: "FREE APPRAISALS — Call (888) 427-2302",
  ctaBannerText: "GOT QUESTIONS? CONTACT US AT (888) 427-2302",
  tagline: "We buy cars for cash — hassle free.",
  yelpUrl: "https://www.yelp.com",
  yelpRating: 5,
};

export const defaultNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Appointments", href: "/schedule-appointment/" },
  { label: "Testimonials", href: "/testimonials/" },
  { label: "Locations", href: "/branch-locations/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export const defaultHomePage: HomePageContent = {
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
};

export const defaultWhyUsCards = [
  { title: "45 Mins or Less", description: "Quick in-and-out appraisal process." },
  { title: "7 Days or 350 Miles", description: "Your offer is guaranteed for 7 days." },
  { title: "We Pay the Same Day", description: "Walk out with a check today." },
  { title: "Fair Offers", description: "Transparent, market-based pricing." },
  {
    title: "We Are Experts",
    description: "28+ years buying cars in Southern California.",
  },
  {
    title: "We Take Care of Everything",
    description: "Paperwork, payoffs, and DMV handled.",
  },
];

export type { AboutPageContent, AppointmentPageContent, HomePageContent };
