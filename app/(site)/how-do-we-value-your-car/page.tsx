import {
  CmsMarkdownPage,
  generateCmsPageMetadata,
} from "@/components/sections/CmsMarkdownPage";

export async function generateMetadata() {
  return generateCmsPageMetadata({
    slug: "how-do-we-value-your-car",
    path: "/how-do-we-value-your-car/",
    fallbackTitle: "How We Determine the Value of Your Car",
    fallbackDescription:
      "How Trade-In Solutions Irvine appraises your car — condition, mileage, market trends, and fair pricing.",
  });
}

export default function HowWeValueYourCarPage() {
  return (
    <CmsMarkdownPage
      slug="how-do-we-value-your-car"
      eyebrow="Car Appraisal"
      fallbackTitle="How We Determine the Value of Your Car"
      fallbackSubtitle="A detailed, in-person appraisal — not a ballpark over the phone."
    />
  );
}
