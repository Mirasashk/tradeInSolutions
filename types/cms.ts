export type CmsStatus = "draft" | "published";

export type CmsVersionAction = "draft" | "published" | "revert" | "create";

export type CmsWriteMeta = {
  uid: string;
  email?: string;
  restoredFromVersionId?: string;
};

export type CmsVersion = {
  id: string;
  createdAt?: string;
  createdBy?: { uid: string; email?: string };
  action: CmsVersionAction;
  status: CmsStatus;
  snapshot: Record<string, unknown>;
  restoredFromVersionId?: string;
};

export const CMS_VERSIONS_SUBCOLLECTION = "versions" as const;

export const CMS_VERSIONED_COLLECTIONS = [
  "cmsSingletons",
  "cmsPages",
  "cmsBlogPosts",
  "cmsTestimonials",
  "cmsLocations",
  "cmsFaqItems",
  "cmsTeamMembers",
  "cmsTrustBadges",
  "cmsCaseStudies",
  "cmsSocialProofItems",
] as const;

export type CmsVersionedCollection = (typeof CMS_VERSIONED_COLLECTIONS)[number];

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

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AppointmentLead = LeadRecord & {
  type: "appointment";
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleMileage?: string;
  conditionDescription?: string;
  hasPreviousOffer?: boolean;
  notes?: string;
  appointmentStatus?: AppointmentStatus;
};
