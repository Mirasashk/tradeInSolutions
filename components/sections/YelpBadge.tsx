"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { trackOutboundClick } from "@/lib/analytics";

export function YelpBadge({
  yelpUrl,
  rating = 5,
}: {
  yelpUrl?: string;
  rating?: number;
}) {
  const url = yelpUrl ?? "https://www.yelp.com";

  return (
    <section className="px-4 py-8 text-center">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOutboundClick("yelp")}
        className="inline-flex flex-col items-center gap-2 rounded-lg border px-8 py-4 hover:border-brand-gold"
      >
        <span className="font-semibold text-brand-navy">People Love Us on Yelp</span>
        <span className="flex items-center gap-1 text-brand-gold">
          {Array.from({ length: Math.round(rating) }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </span>
      </Link>
    </section>
  );
}
