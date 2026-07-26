import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";
import { getBlogSlugs } from "@/lib/cms/fetch";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/about-us/",
  "/faq/",
  "/schedule-appointment/",
  "/testimonials/",
  "/branch-locations/",
  "/blog/",
  "/contact/",
  "/privacy-policy/",
  "/beat-your-offer/",
  "/value-estimator/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const blogSlugs = await getBlogSlugs();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map(({ slug }) => ({
    url: `${baseUrl}/blog/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
