import {
  CmsMarkdownPage,
  generateCmsPageMetadata,
} from "@/components/sections/CmsMarkdownPage";

export async function generateMetadata() {
  return generateCmsPageMetadata({
    slug: "how-it-works",
    path: "/how-it-works/",
    fallbackTitle: "How Does Trade-In Solutions Work?",
    fallbackDescription:
      "Learn how Trade-In Solutions Irvine works — schedule an appointment, get a fair offer in as little as 45 minutes, and walk out with a check the same day.",
  });
}

export default function HowItWorksPage() {
  return (
    <CmsMarkdownPage
      slug="how-it-works"
      eyebrow="How It Works"
      fallbackTitle="How Does Trade-In Solutions Work?"
      fallbackSubtitle="From appointment to check — our simple, transparent process."
    />
  );
}
