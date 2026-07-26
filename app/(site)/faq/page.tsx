import Link from "next/link";

import { Reveal } from "@/components/shared/motion";
import { FaqSearch } from "@/components/sections/FaqSearch";
import { PageHero } from "@/components/sections/PageHero";
import { buildFaqPageJsonLd, buildMetadataFromCms } from "@/lib/seo";
import { getFaqItems, getSiteSettings } from "@/lib/cms/fetch";
import type { FaqItem } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "FAQ",
    description:
      "Frequently asked questions about selling your car in Irvine and Orange County — leased cars, financed cars, appraisals, and more.",
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
  const [faqItems, settings] = await Promise.all([getFaqItems(), getSiteSettings()]);
  const items = (faqItems as FaqItem[]).length ? (faqItems as FaqItem[]) : fallbackFaqs;
  const jsonLd = buildFaqPageJsonLd(items);
  const phoneHref = settings.phone.replace(/\D/g, "");

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about selling your car — leased, financed, or owned outright."
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <FaqSearch items={items} />

        <Reveal className="mt-14">
          <div className="rounded-2xl border bg-muted/40 p-8 text-center">
            <h2 className="text-xl font-bold text-brand-navy">Still have questions?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team is happy to walk you through the process — no pressure, no
              obligation.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact/"
                className="rounded-md bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.03]"
              >
                Contact Us
              </Link>
              <Link
                href={`tel:${phoneHref}`}
                className="rounded-md border px-6 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold"
              >
                Call {settings.phone}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
