import { CMS_COLLECTIONS, CMS_SINGLETON_IDS, type CmsStatus } from "@/types/cms";
import type {
  AboutPageContent,
  AppointmentPageContent,
  BlogPost,
  BlogPostSummary,
  CaseStudy,
  FaqItem,
  HomePageContent,
  LeadMagnet,
  Location,
  NavItem,
  PageContent,
  SiteSettings,
  SocialProofItem,
  TeamMember,
  Testimonial,
  TrustBadge,
} from "@/types";

import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { getAdminDb, timestampToIso } from "./admin";
import {
  defaultHomePage,
  defaultNavigation,
  defaultSiteSettings,
  defaultWhyUsCards,
} from "./defaults";
import { normalizeFaqItems, normalizeNavItems } from "./normalize";

type DocData = Record<string, unknown>;

function withId<T>(id: string, data: DocData): T {
  return { ...data, _id: id } as unknown as T;
}

function stripMeta(data: DocData): DocData {
  const { status, updatedAt, publishedAt, legacySanityId, ...rest } = data;
  void status;
  void updatedAt;
  void publishedAt;
  void legacySanityId;
  return rest;
}

async function getSingleton<T>(docId: string): Promise<T | null> {
  const db = getAdminDb();
  if (!db) return null;

  try {
    const snap = await db.collection(CMS_COLLECTIONS.singletons).doc(docId).get();
    if (!snap.exists) return null;

    const data = snap.data() as DocData;
    if (data.status !== "published") return null;

    return stripMeta(data) as T;
  } catch {
    return null;
  }
}

function sortDocs(
  docs: QueryDocumentSnapshot[],
  field: string,
  direction: "asc" | "desc",
) {
  const factor = direction === "asc" ? 1 : -1;
  return [...docs].sort((a, b) => {
    const av = a.data()[field];
    const bv = b.data()[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "string" && typeof bv === "string") {
      return av.localeCompare(bv) * factor;
    }
    return (Number(av) - Number(bv)) * factor;
  });
}

async function listPublished<T>(
  collection: string,
  orderBy?: { field: string; direction: "asc" | "desc" },
  filter?: (data: DocData) => boolean,
): Promise<T[]> {
  const db = getAdminDb();
  if (!db) return [];

  try {
    let docs;

    if (orderBy) {
      try {
        const snap = await db
          .collection(collection)
          .where("status", "==", "published" satisfies CmsStatus)
          .orderBy(orderBy.field, orderBy.direction)
          .get();
        docs = snap.docs;
      } catch {
        // Index may not be deployed yet — fetch published docs and sort in memory.
        const snap = await db
          .collection(collection)
          .where("status", "==", "published" satisfies CmsStatus)
          .get();
        docs = sortDocs(snap.docs, orderBy.field, orderBy.direction);
      }
    } else {
      const snap = await db
        .collection(collection)
        .where("status", "==", "published" satisfies CmsStatus)
        .get();
      docs = snap.docs;
    }

    return docs
      .map((doc) => withId<T>(doc.id, stripMeta(doc.data() as DocData)))
      .filter((item) => (filter ? filter(item as DocData) : true));
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSingleton<SiteSettings>(CMS_SINGLETON_IDS.siteSettings);
  return settings ?? defaultSiteSettings;
}

export async function getNavigation(): Promise<NavItem[]> {
  const nav = await getSingleton<{ items: NavItem[] }>(CMS_SINGLETON_IDS.navigation);
  if (!nav?.items?.length) {
    return defaultNavigation;
  }
  return normalizeNavItems(nav.items);
}

export async function getHomePage(): Promise<HomePageContent> {
  const page = await getSingleton<HomePageContent>(CMS_SINGLETON_IDS.homePage);
  return { ...defaultHomePage, ...page };
}

export async function getAboutPage(): Promise<AboutPageContent | null> {
  return getSingleton<AboutPageContent>(CMS_SINGLETON_IDS.aboutPage);
}

export async function getAppointmentPage() {
  const page = await getSingleton<AppointmentPageContent>(
    CMS_SINGLETON_IDS.appointmentPage,
  );
  return {
    ...page,
    whyUsCards: page?.whyUsCards?.length ? page.whyUsCards : defaultWhyUsCards,
  };
}

export async function getTeamMembers() {
  return listPublished<TeamMember>(CMS_COLLECTIONS.teamMembers, {
    field: "order",
    direction: "asc",
  });
}

export async function getPageBySlug(slug: string) {
  const pages = await listPublished<PageContent>(CMS_COLLECTIONS.pages);
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function getBlogPosts() {
  return listPublished<BlogPostSummary>(CMS_COLLECTIONS.blogPosts, {
    field: "publishedAt",
    direction: "desc",
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await listPublished<BlogPost>(CMS_COLLECTIONS.blogPosts, {
    field: "publishedAt",
    direction: "desc",
  });
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  if (post.relatedPostIds?.length) {
    const relatedPosts = posts.filter((p) => post.relatedPostIds!.includes(p._id));
    return { ...post, relatedPosts };
  }

  return post;
}

export async function getBlogSlugs() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function getTestimonials(limit?: number) {
  const list = await listPublished<Testimonial>(CMS_COLLECTIONS.testimonials, {
    field: "publishedAt",
    direction: "desc",
  });
  return limit ? list.slice(0, limit) : list;
}

export async function getLocations() {
  return listPublished<Location>(CMS_COLLECTIONS.locations, {
    field: "name",
    direction: "asc",
  });
}

export async function getFaqItems() {
  const items = await listPublished<FaqItem>(CMS_COLLECTIONS.faqItems, {
    field: "order",
    direction: "asc",
  });
  return normalizeFaqItems(items);
}

export async function getTrustBadges() {
  return listPublished<TrustBadge>(CMS_COLLECTIONS.trustBadges, {
    field: "order",
    direction: "asc",
  });
}

export async function getCaseStudies() {
  return listPublished<CaseStudy>(
    CMS_COLLECTIONS.caseStudies,
    { field: "order", direction: "asc" },
    (data) => data.hasPermission === true,
  );
}

export async function getLeadMagnet() {
  return getSingleton<LeadMagnet>(CMS_SINGLETON_IDS.leadMagnet);
}

export async function getSocialProofItems() {
  return listPublished<SocialProofItem>(CMS_COLLECTIONS.socialProofItems, {
    field: "order",
    direction: "asc",
  });
}

export { timestampToIso };
