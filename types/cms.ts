export type CmsStatus = "draft" | "published";

export type CmsImage = {
  storagePath?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type CmsMeta = {
  status: CmsStatus;
  updatedAt?: string;
  publishedAt?: string;
  legacySanityId?: string;
};

export const CMS_COLLECTIONS = {
  singletons: "cmsSingletons",
  pages: "cmsPages",
  blogPosts: "cmsBlogPosts",
  testimonials: "cmsTestimonials",
  locations: "cmsLocations",
  faqItems: "cmsFaqItems",
  teamMembers: "cmsTeamMembers",
  trustBadges: "cmsTrustBadges",
  caseStudies: "cmsCaseStudies",
  socialProofItems: "cmsSocialProofItems",
  leads: "leads",
  admins: "admins",
} as const;

export const CMS_SINGLETON_IDS = {
  siteSettings: "siteSettings",
  navigation: "navigation",
  homePage: "homePage",
  aboutPage: "aboutPage",
  appointmentPage: "appointmentPage",
  leadMagnet: "leadMagnet",
} as const;

export type AdminUser = {
  email: string;
  role: "admin";
  createdAt?: string;
};

export type LeadRecord = {
  id: string;
  type: "contact" | "appointment" | "beat_offer" | "value_estimator";
  createdAt?: string;
  [key: string]: unknown;
};
