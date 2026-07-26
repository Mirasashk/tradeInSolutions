import type { CmsImage } from "./cms";

export type {
  CmsImage,
  CmsStatus,
  CmsMeta,
  AdminUser,
  LeadRecord,
  AppointmentLead,
  AppointmentStatus,
  CmsVersion,
  CmsVersionAction,
  CmsWriteMeta,
  CmsVersionedCollection,
} from "./cms";
export { CMS_VERSIONS_SUBCOLLECTION, CMS_VERSIONED_COLLECTIONS } from "./cms";

/** @deprecated Use CmsImage */
export type SanityImage = CmsImage;

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  announcementText?: string;
  ctaBannerText?: string;
  tagline?: string;
  logo?: CmsImage;
  footerLogo?: CmsImage;
  defaultOgImage?: CmsImage;
  yelpUrl?: string;
  yelpRating?: number;
  googleUrl?: string;
  facebookUrl?: string;
  mapEmbedUrl?: string;
  exitIntentTitle?: string;
  exitIntentMessage?: string;
  liveChatScriptUrl?: string;
  calendlyUrl?: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type HomePageContent = {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroImage?: CmsImage;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  videoUrl?: string;
  whySellHeadline?: string;
  whySellBullets?: string[];
  compareHeadline?: string;
  compareBullets?: string[];
  socialProofItems?: string[];
};

export type AboutPageContent = {
  heroTitle?: string;
  story?: string;
  confidenceGuarantee?: string;
};

export type AppointmentPageContent = {
  heroTitle?: string;
  heroSubtitle?: string;
  whyUsCards?: { title?: string; description?: string }[];
  checklistOwned?: string[];
  checklistFinanced?: string[];
  checklistLeased?: string[];
};

export type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: CmsImage;
  order?: number;
};

export type BlogPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  author?: string;
  mainImage?: CmsImage;
};

export type BlogPost = BlogPostSummary & {
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedPostIds?: string[];
  relatedPosts?: BlogPostSummary[];
};

export type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  carModel?: string;
  quote: string;
  rating?: number;
  publishedAt?: string;
  videoUrl?: string;
};

export type Location = {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  phones?: string[];
  hours?: string;
  locationType?: string;
  isFieldAppraisalOnly?: boolean;
  note?: string;
  photo?: CmsImage;
  mapEmbedUrl?: string;
  latitude?: number;
  longitude?: number;
  directions?: string;
};

export type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  order?: number;
  anchorId?: string;
};

export type PageContent = {
  _id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: string;
};

export type TrustBadge = {
  _id: string;
  label: string;
  icon?: CmsImage;
  link?: string;
  order?: number;
};

export type CaseStudy = {
  _id: string;
  customerName?: string;
  carModel?: string;
  dealerOffer?: number;
  ourOffer?: number;
  photo?: CmsImage;
  hasPermission?: boolean;
  order?: number;
};

export type LeadMagnet = {
  title?: string;
  description?: string;
  downloadUrl?: string;
};

export type SocialProofItem = {
  _id: string;
  text: string;
  order?: number;
};

export type WhyUsCard = {
  title?: string;
  description?: string;
};
