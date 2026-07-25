import type { Metadata } from "next";

const siteName = "Trade-In Solutions Irvine";
const defaultDescription =
  "Sell your car for cash in Irvine and Orange County. Free appraisal, same-day payment, hassle-free process.";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradeinsolutions-irvine.com";
}

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description ?? defaultDescription;

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
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: getSiteUrl(),
    telephone: "+1-888-427-2302",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Irvine",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: ["Irvine", "Orange County", "Los Angeles", "San Diego"],
    priceRange: "$$",
  };
}

export { siteName, defaultDescription };
