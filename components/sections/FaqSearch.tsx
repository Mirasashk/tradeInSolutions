"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import type { FaqItem } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableTextContent } from "@/components/shared/PortableTextContent";

export function FaqSearch({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.question.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <Input
        type="search"
        placeholder="Search FAQ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6"
      />
      <Accordion type="single" collapsible>
        {filtered.map((item, index) => (
          <AccordionItem
            key={item._id || `faq-${index}`}
            value={item._id || `faq-${index}`}
            id={item.anchorId ?? undefined}
          >
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <PortableTextContent value={item.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matching questions.</p>
      ) : null}
    </div>
  );
}
