import type {
  BlogPost,
  BlogPostSummary,
  FaqItem,
  Location,
  NavItem,
  PageContent,
  SiteSettings,
  Testimonial,
} from "@/types";

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  phone,
  email,
  address,
  hours,
  announcementText,
  ctaBannerText
}`;

export const NAVIGATION_QUERY = `*[_type == "navigation"][0]{
  items[]{
    label,
    href
  }
}`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,
  body
}`;

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  seoTitle,
  seoDescription,
  body
}`;

export const BLOG_SLUGS_QUERY = `*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  name,
  location,
  carModel,
  quote
}`;

export const LOCATIONS_QUERY = `*[_type == "location"] | order(name asc){
  _id,
  name,
  address,
  phone,
  hours
}`;

export const FAQ_ITEMS_QUERY = `*[_type == "faqItem"] | order(order asc){
  _id,
  question,
  answer
}`;

export type SanityQueryResults = {
  siteSettings: SiteSettings | null;
  navigation: { items: NavItem[] } | null;
  page: PageContent | null;
  blogPosts: BlogPostSummary[];
  blogPost: BlogPost | null;
  blogSlugs: { slug: string }[];
  testimonials: Testimonial[];
  locations: Location[];
  faqItems: FaqItem[];
};

export const defaultSiteSettings: SiteSettings = {
  phone: "(888) 427-2302",
  email: "info@tradeinsolutions-irvine.com",
  address: "Irvine, CA",
  hours: "Mon–Sat 9am–6pm",
  announcementText: "FREE APPRAISALS — Call (888) 427-2302",
  ctaBannerText: "GOT QUESTIONS? CONTACT US AT (888) 427-2302",
};

export const defaultNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Schedule", href: "/schedule-appointment/" },
  { label: "Testimonials", href: "/testimonials/" },
  { label: "Locations", href: "/branch-locations/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];
