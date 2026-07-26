import {
  CmsMarkdownPage,
  generateCmsPageMetadata,
} from "@/components/sections/CmsMarkdownPage";

export async function generateMetadata() {
  return generateCmsPageMetadata({
    slug: "what-to-bring-for-the-sale",
    path: "/what-to-bring-for-the-sale/",
    fallbackTitle: "What Do I Need to Bring With Me?",
    fallbackDescription:
      "What to bring when selling your car to Trade-In Solutions Irvine — title, registration, photo ID, keys, and remotes.",
  });
}

export default function WhatToBringPage() {
  return (
    <CmsMarkdownPage
      slug="what-to-bring-for-the-sale"
      eyebrow="What to Bring"
      fallbackTitle="What Do I Need to Bring With Me?"
      fallbackSubtitle="Everything you need for a smooth, same-day sale."
    />
  );
}
