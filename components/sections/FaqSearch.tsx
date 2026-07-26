"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { FaqItem } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { Stagger, StaggerItem } from "@/components/shared/motion";

export function FaqSearch({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.question.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Ask a question…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 rounded-full pl-11 pr-5 shadow-sm"
          aria-label="Search FAQ"
        />
      </div>

      <Stagger className="mt-8">
        <Accordion type="single" collapsible className="space-y-3">
          {filtered.map((item, index) => (
            <StaggerItem key={item._id || `faq-${index}`}>
              <AccordionItem
                value={item._id || `faq-${index}`}
                id={item.anchorId ?? undefined}
                className="scroll-mt-28 rounded-xl border bg-card px-5 shadow-sm transition-colors last:border-b data-[state=open]:border-brand-gold/50"
              >
                <AccordionTrigger className="py-5 text-base font-semibold text-brand-navy hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  <PortableTextContent value={item.answer} />
                </AccordionContent>
              </AccordionItem>
            </StaggerItem>
          ))}
        </Accordion>
      </Stagger>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No matching questions — try a different search, or{" "}
          <a href="/contact/" className="font-medium text-brand-gold hover:underline">
            contact us directly
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
