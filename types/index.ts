export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  announcementText?: string;
  ctaBannerText?: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type BlogPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
};

export type BlogPost = BlogPostSummary & {
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  carModel?: string;
  quote: string;
};

export type Location = {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
};

export type FaqItem = {
  _id: string;
  question: string;
  answer: unknown;
};

export type PageContent = {
  _id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: unknown;
};
