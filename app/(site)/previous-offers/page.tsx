import {
  CmsMarkdownPage,
  generateCmsPageMetadata,
} from "@/components/sections/CmsMarkdownPage";

export async function generateMetadata() {
  return generateCmsPageMetadata({
    slug: "previous-offers",
    path: "/previous-offers/",
    fallbackTitle: "Compare Other Dealer Offers",
    fallbackDescription:
      "Got a written offer from another dealer? Trade-In Solutions Irvine will compare it and work to beat it.",
  });
}

export default function PreviousOffersPage() {
  return (
    <CmsMarkdownPage
      slug="previous-offers"
      eyebrow="Previous Offers"
      fallbackTitle="Compare Other Dealer Offers"
      fallbackSubtitle="Bring us any written offer — we'll compare it head to head."
    />
  );
}
