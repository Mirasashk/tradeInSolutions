import {
  BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
  FAQ_ITEMS_QUERY,
  LOCATIONS_QUERY,
  NAVIGATION_QUERY,
  PAGE_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
  defaultNavigation,
  defaultSiteSettings,
} from "./queries";
import { getBuildClient } from "./client";
import { isSanityConfigured } from "./env";

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    return await getBuildClient().fetch<T>(query, params);
  } catch {
    return null;
  }
}

export async function getSiteSettings() {
  const settings = await safeFetch<typeof defaultSiteSettings>(SITE_SETTINGS_QUERY);
  return settings ?? defaultSiteSettings;
}

export async function getNavigation() {
  const nav = await safeFetch<{ items: typeof defaultNavigation }>(NAVIGATION_QUERY);
  return nav?.items?.length ? nav.items : defaultNavigation;
}

export async function getPageBySlug(slug: string) {
  return safeFetch(PAGE_BY_SLUG_QUERY, { slug });
}

export async function getBlogPosts() {
  const posts = await safeFetch<unknown[]>(BLOG_POSTS_QUERY);
  return posts ?? [];
}

export async function getBlogPostBySlug(slug: string) {
  return safeFetch(BLOG_POST_BY_SLUG_QUERY, { slug });
}

export async function getBlogSlugs() {
  const slugs = await safeFetch<{ slug: string }[]>(BLOG_SLUGS_QUERY);
  return slugs ?? [];
}

export async function getTestimonials() {
  const items = await safeFetch<unknown[]>(TESTIMONIALS_QUERY);
  return items ?? [];
}

export async function getLocations() {
  const items = await safeFetch<unknown[]>(LOCATIONS_QUERY);
  return items ?? [];
}

export async function getFaqItems() {
  const items = await safeFetch<unknown[]>(FAQ_ITEMS_QUERY);
  return items ?? [];
}
