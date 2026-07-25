import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { buildMetadata } from "@/lib/seo";
import { getFaqItems } from "@/lib/sanity/fetch";
import type { FaqItem } from "@/types";

export const metadata = buildMetadata({
  title: "FAQ",
  path: "/faq/",
});

const fallbackFaqs: FaqItem[] = [
  {
    _id: "1",
    question: "How does the appraisal process work?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Schedule a free appointment and receive a fair cash offer.",
          },
        ],
      },
    ],
  },
  {
    _id: "2",
    question: "Do I need to buy another car from you?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "No. We buy cars outright with no purchase requirement.",
          },
        ],
      },
    ],
  },
];

export default async function FaqPage() {
  const faqItems = (await getFaqItems()) as FaqItem[];
  const items = faqItems.length ? faqItems : fallbackFaqs;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="mt-8">
        {items.map((item) => (
          <AccordionItem key={item._id} value={item._id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <PortableTextContent value={item.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
