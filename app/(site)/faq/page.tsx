import { FaqSearch } from "@/components/sections/FaqSearch";
import { buildFaqPageJsonLd, buildMetadataFromCms } from "@/lib/seo";
import { getFaqItems, getSiteSettings } from "@/lib/cms/fetch";
import type { FaqItem } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "FAQ",
    description:
      "Frequently asked questions about selling your car in Irvine and Orange County.",
    path: "/faq/",
    settings,
  });
}

const fallbackFaqs: FaqItem[] = [
  {
    _id: "1",
    question: "Do I need to schedule an appointment for an appraisal?",
    answer: "Yes — scheduling ensures an appraiser is ready for you.",
  },
  {
    _id: "2",
    question: "Can you beat other dealer offers?",
    anchorId: "compare-offers",
    answer: "Bring any written offer — we will beat it or explain why.",
  },
];

export default async function FaqPage() {
  const faqItems = (await getFaqItems()) as FaqItem[];
  const items = faqItems.length ? faqItems : fallbackFaqs;
  const jsonLd = buildFaqPageJsonLd(items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold text-brand-navy">Frequently Asked Questions</h1>
      <p className="mt-4 text-muted-foreground">
        Search our FAQ or browse common questions about selling your car.
      </p>
      <div className="mt-8">
        <FaqSearch items={items} />
      </div>
    </div>
  );
}
