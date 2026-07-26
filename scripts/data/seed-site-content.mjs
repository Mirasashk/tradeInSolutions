/**
 * Singleton documents and small collections (locations, team, trust badges,
 * social proof, static pages) migrated from the original site.
 * `file` values inside image fields refer to files in /assets.
 */

export const singletons = {
  siteSettings: {
    phone: "(888) 427-2302",
    email: "info@tradeinsolutions-irvine.com",
    address: "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618",
    hours: "Mon–Sat 9am–6pm",
    announcementText: "FREE APPRAISALS — Call (888) 427-2302",
    ctaBannerText: "GOT QUESTIONS? CONTACT US AT (888) 427-2302",
    tagline: "We buy cars for cash — hassle free.",
    yelpUrl: "https://www.yelp.com/biz/trade-in-solutions-irvine",
    yelpRating: 4.5,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=9891+Irvine+Center+Drive+Suite+200,+Irvine,+CA+92618&output=embed",
    defaultOgImage: {
      file: "REVO_04.png",
      alt: "Happy customer holding car keys after selling her car to Trade-In Solutions",
    },
    exitIntentTitle: "Before you go…",
    exitIntentMessage:
      "Get a free, no-obligation appraisal for your car. Most appointments take 45 minutes or less and you can walk out with a check the same day.",
  },
  navigation: {
    items: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Appointments", href: "/schedule-appointment/" },
      { label: "Testimonials", href: "/testimonials/" },
      { label: "Locations", href: "/branch-locations/" },
      { label: "Blog", href: "/blog/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  homePage: {
    heroHeadline: "We Will Buy Your Car Today — Absolutely Hassle Free!",
    heroSubheadline:
      "Get a fair cash offer with a free appraisal. In as little as 45 minutes you walk out with a check — we handle all the DMV paperwork.",
    heroImage: {
      file: "REVO_04.png",
      alt: "Happy customer holding car keys after selling her car",
    },
    heroPrimaryCtaLabel: "Get Your Free Appraisal",
    heroPrimaryCtaHref: "/schedule-appointment/",
    heroSecondaryCtaLabel: "Call (888) 427-2302",
    heroSecondaryCtaHref: "tel:8884272302",
    whySellHeadline: "Why Should I Sell My Car to Trade-In Solutions?",
    whySellBullets: [
      "Free appraisal with no obligation",
      "Offer guaranteed for 7 days or 350 miles",
      "Same-day payment — walk out with a check",
      "28+ years of automotive industry experience",
      "We handle all DMV paperwork for you",
      "We buy all makes and models, financed and leased cars too",
    ],
    compareHeadline: "Compare Other Offers to Trade-In Solutions",
    compareBullets: [
      "Free appraisal",
      "Expert appraisers",
      "Market trend analysis",
      "7-day / 350-mile offer guarantee",
      "Fully explained appraisal process",
      "Immediate check — same day",
      "45-minute process, start to finish",
    ],
  },
  aboutPage: {
    heroTitle: "About Trade-In Solutions",
    story: `After collectively spending over 28 years in the automotive industry and listening to literally thousands of customers, the founders of Trade-In Solutions felt it was shameful to hear how burdensome it was to deal with typical automotive dealers and the exhaustive process of negotiating the value of their trade-in for a down payment. Ultimately getting less than fair market value for their vehicle from most dealers makes the entire process even worse.

The founders listened to what consumers had to say and came up with the innovative process that is now the hallmark of Trade-In Solutions Irvine — a concept designed to make selling a car a virtually stress-free and rewarding experience.

No more wasted hours of useless negotiation and the dealer's attempt to hide or bury the "true value" offered for the trade-in. Instead, Trade-In Solutions customers are treated to a simple three-step process of selling their vehicle:

1. Make an appointment
2. Have an inspection and appraisal
3. Get a check

It's that easy.`,
    confidenceGuarantee: `Trade-In Solutions is so confident that customers will be completely satisfied with their appraisal and offer to purchase, we suggest going to a traditional dealer first to get a written offer — then bring that written offer with you.

The absence of stress and the financial benefit of doing business with Trade-In Solutions Irvine will be immediately obvious. **Guaranteed!**

Don't wait — call today to make an appointment.`,
  },
  appointmentPage: {
    heroTitle: "Schedule Your Free Appraisal",
    heroSubtitle:
      "Same-day payment available. The entire process takes 45 minutes or less.",
    whyUsCards: [
      {
        title: "45 Mins or Less",
        description:
          "We value your time. The entire process — from appraisal inspection to documentation completion and payment — takes 45 minutes or less.",
      },
      {
        title: "7 Days or 350 Miles",
        description: "Our free appraisal is good for more than one day.",
      },
      {
        title: "We Pay the Same Day",
        description: "If we agree on a price, you can have usable funds the same day.",
      },
      {
        title: "Fair Offers",
        description:
          "We strive to provide fair market value to all our customers — one of the biggest challenges when selling your car to a dealership.",
      },
      {
        title: "We Are Experts",
        description: "Decades of experience in the automotive industry.",
      },
      {
        title: "We Take Care of Everything",
        description:
          "You don't need to deal with individual inquiries by selling your car privately. We handle the paperwork, the DMV, and the payoff.",
      },
    ],
    checklistOwned: [
      "Certificate of title",
      "Current registration",
      "Valid driver's license for all registered owners",
      "All keys and remotes",
    ],
    checklistFinanced: [
      "10-day payoff quote from your lender (including account number)",
      "Current registration",
      "Valid driver's license — all registered owners, cosigners, or co-applicants must be present",
      "All keys and remotes",
    ],
    checklistLeased: [
      "Lease agreement / account information",
      "Current registration",
      "Valid driver's license for all lessees",
      "All keys and remotes",
    ],
  },
  leadMagnet: {
    title: "Free Car Selling Guide",
    description:
      "Learn how appraisals work, what documents you need, and how to get the best offer for your vehicle — straight from our appraisers.",
    downloadUrl: "/blog/",
  },
};

export const locations = [
  {
    key: "irvine-orange-county",
    name: "Irvine / Orange County",
    address: "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618",
    phones: ["(888) 427-2302", "(949) 398-8232"],
    hours: "Mon–Sat 9am–6pm",
    locationType: "Buying Center",
    isFieldAppraisalOnly: false,
    photo: { file: "Tis-Front-1.jpg", alt: "Trade-In Solutions Irvine buying center" },
    mapEmbedUrl:
      "https://maps.google.com/maps?q=9891+Irvine+Center+Drive+Suite+200,+Irvine,+CA+92618&output=embed",
    directions: `**Coming from the 405 South to 5 South:**

1. Exit Lake Forest
2. Make a right on Lake Forest
3. Make a right on Research Dr
4. Make a left on Inquiry — pass through the roundabout and the building is on your right side. Suite 200 is located on the second floor.

**Coming from the 5 North:**

1. Exit Lake Forest
2. Make a left on Lake Forest
3. Make a right on Research Dr
4. Make a left on Inquiry — pass through the roundabout and the building is on your right side. Suite 200 is located on the second floor.`,
  },
  {
    key: "west-los-angeles-santa-monica",
    name: "W. Los Angeles / Santa Monica",
    address: "11400 W. Olympic Blvd., Suite 650, West Los Angeles, CA 90064",
    phones: ["(877) 306-9800", "(310) 473-2277"],
    hours: "By appointment",
    locationType: "Office",
    isFieldAppraisalOnly: false,
    photo: {
      file: "tis_LA.jpg",
      alt: "Trade-In Solutions West Los Angeles office building",
    },
    mapEmbedUrl:
      "https://maps.google.com/maps?q=11400+W+Olympic+Blvd+Suite+650,+Los+Angeles,+CA+90064&output=embed",
  },
  {
    key: "san-diego-county",
    name: "San Diego / San Diego County",
    address: "San Diego, CA",
    phones: ["(888) 427-2302", "(858) 925-3349"],
    hours: "By appointment",
    locationType: "Field Appraisal",
    isFieldAppraisalOnly: true,
    note: "Field appraisal only — our appraiser will come to you!",
    photo: {
      file: "tis_SD.jpg",
      alt: "Our appraiser will come to you — field appraisal",
    },
  },
];

export const teamMembers = [
  {
    key: "adel-moini",
    name: "Adel Moini",
    role: "Lead Appraiser",
    order: 1,
    bio: "Adel has spent decades in the automotive industry and personally handles appraisals at our Irvine buying center. Customers consistently describe him as honest, transparent, and patient — he walks every seller through exactly how their offer was calculated.",
  },
];

export const trustBadges = [
  {
    key: "years-in-business",
    label: "28+ Years of Automotive Experience",
    order: 1,
  },
  {
    key: "yelp-rating",
    label: "4.5 Stars on Yelp — 100+ Reviews",
    order: 2,
    link: "https://www.yelp.com/biz/trade-in-solutions-irvine",
    icon: { file: "yelp_icn.png", alt: "Yelp logo" },
  },
  {
    key: "top-auto-broker",
    label: "Top 3 Auto Broker in Irvine — BusinessRate 2025",
    order: 3,
  },
  {
    key: "same-day-payment",
    label: "Same-Day Payment",
    order: 4,
  },
  {
    key: "offer-guarantee",
    label: "Offers Good for 7 Days or 350 Miles",
    order: 5,
  },
];

export const socialProofItems = [
  { key: "sp-1", text: "Recently purchased: BMW 128i from Julie in Irvine", order: 1 },
  {
    key: "sp-2",
    text: "Recently purchased: Audi R8 from Chris in Fullerton",
    order: 2,
  },
  {
    key: "sp-3",
    text: "Recently purchased: Jeep Wrangler from Shannon in Rancho Santa Margarita",
    order: 3,
  },
  {
    key: "sp-4",
    text: "Recently purchased: Lexus GS350 from Leonard in South Pasadena",
    order: 4,
  },
  {
    key: "sp-5",
    text: "Recently purchased: Mercedes-Benz G500 from Depak in San Clemente",
    order: 5,
  },
  {
    key: "sp-6",
    text: "Recently purchased: Toyota Tundra from Joshua in Irvine",
    order: 6,
  },
];

export const pages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy",
    seoDescription:
      "How Trade-In Solutions Irvine collects, uses, and protects your personal information.",
    body: `**Effective Date: Dec 15, 2023**

## 1. Information Collection

We collect the following types of information:

- Personal information (such as name, email address, and contact details) provided by users voluntarily.
- Non-personal information, including but not limited to browser information, IP addresses, and cookies.

## 2. Data Collection Purpose

We collect data to:

- Improve user experience on our website.
- Personalize user interactions.
- Respond to inquiries and provide customer support.
- Analyze website traffic and trends.

## 3. Data Collection Methods

We collect information through:

- Voluntary user submissions via forms or other interactive features.
- Automated technologies, such as cookies, for analytics and website functionality.

## 4. Opt-Out Option

Users can opt out of:

- Receiving promotional communications by following the unsubscribe instructions in the communication received.
- Cookies by adjusting browser settings.

## 5. Third-Party Data Sharing

We do not share user data with third parties, except:

- Trusted third-party service providers for specific business functions.

## 6. Data Retention

We retain user data for:

- A specific duration necessary to fulfill the purposes outlined in this policy.
- Longer if required by law or for legitimate business purposes.

By using our website, you agree to the terms outlined in this Privacy Policy. This policy is subject to periodic updates, and users are encouraged to review it regularly.

For any privacy-related inquiries, please contact us at info@tradeinsolutions-irvine.com.`,
  },
];
