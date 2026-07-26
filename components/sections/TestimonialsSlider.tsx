"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Testimonial } from "@/types";

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const visible = testimonials.slice(0, 6);

  useEffect(() => {
    if (visible.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % visible.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visible.length]);

  if (!visible.length) return null;

  const current = visible[index];

  return (
    <section className="bg-muted/40 px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy">What Our Customers Say</h2>
        <Card className="mt-8 text-left">
          <CardHeader>
            <CardTitle className="text-lg">{current.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {[current.location, current.carModel].filter(Boolean).join(" • ")}
            </p>
          </CardHeader>
          <CardContent>
            <p className="italic text-muted-foreground">
              &ldquo;{current.quote}&rdquo;
            </p>
          </CardContent>
        </Card>
        <Link
          href="/testimonials/"
          className="mt-6 inline-block text-sm font-medium text-brand-gold hover:underline"
        >
          Read all testimonials →
        </Link>
      </div>
    </section>
  );
}
