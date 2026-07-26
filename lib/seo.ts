import type { Metadata } from "next";

import { cmsImageUrl } from "@/components/shared/CmsImage";
import type { BlogPost, FaqItem, Location, SiteSettings, Testimonial } from "@/types";

const siteName = "Trade-In Solutions Irvine";
const defaultDescription =
  "Sell your car for cash in Irvine and Orange County. Free appraisal, same-day payment, hassle-free process.";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradeinsolutions-6f0e9.web.app";
}

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  ogImage,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description ?? defaultDescription;
  const imageUrl = ogImage ?? `${getSiteUrl()}/og-default.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName,
      locale: "en_US",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildMetadataFromCms({
  title,
  description,
  path,
  settings,
  seoTitle,
  seoDescription,
  ogImage,
}: {
  title: string;
  path: string;
  settings: SiteSettings;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: Parameters<typeof cmsImageUrl>[0];
}) {
  const defaultOg = cmsImageUrl(settings.defaultOgImage, 1200, 630);
  return buildMetadata({
    title: seoTitle ?? title,
    description: seoDescription ?? description,
    path,
    ogImage: ogImage ? cmsImageUrl(ogImage, 1200, 630) : defaultOg,
  });
}

export function buildLocalBusinessJsonLd(settings?: SiteSettings) {
  const phone = settings?.phone ?? "(888) 427-2302";
  const address =
    settings?.address ?? "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: getSiteUrl(),
    telephone: phone.replace(/[^\d+]/g, "").replace(/^(\d)/, "+1-$1"),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.split(",")[0]?.trim(),
      addressLocality: "Irvine",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: ["Irvine", "Orange County", "Los Angeles", "San Diego"],
    priceRange: "$$",
    ...(settings?.yelpRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: settings.yelpRating,
            reviewCount: 100,
          },
        }
      : {}),
  };
}

export function buildFaqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildReviewJsonLd(testimonials: Testimonial[]) {
  if (!testimonials.length) return null;

  const ratings = testimonials.filter((t) => t.rating).map((t) => t.rating!);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: testimonials.length,
    },
    review: testimonials.slice(0, 10).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      ...(t.rating
        ? {
            reviewRating: {
              "@type": "Rating",
              ratingValue: t.rating,
              bestRating: 5,
            },
          }
        : {}),
    })),
  };
}

export function buildBlogPostingJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: siteName },
    description: post.excerpt,
  };
}

export function buildLocationJsonLd(locations: Location[]) {
  return locations.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: loc.name,
    address: loc.address,
    telephone: loc.phone,
  }));
}

export { siteName, defaultDescription };
