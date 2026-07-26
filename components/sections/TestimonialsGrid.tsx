"use client";

import { Quote } from "lucide-react";

import { StarRating } from "@/components/shared/StarRating";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { Testimonial } from "@/types";

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item) => (
        <StaggerItem key={item._id} className="h-full">
          <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Quote aria-hidden className="h-6 w-6 text-brand-gold/40" />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            {item.videoUrl?.includes("embed") ? (
              <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                <iframe
                  src={item.videoUrl}
                  title={`${item.name} testimonial`}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : null}
            <figcaption className="mt-5 border-t pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-brand-navy">{item.name}</span>
                <StarRating rating={item.rating ?? 5} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {[item.location, item.carModel].filter(Boolean).join(" • ")}
              </p>
              {item.publishedAt ? (
                <p className="mt-0.5 text-xs text-muted-foreground/70">
                  {new Date(item.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : null}
            </figcaption>
          </figure>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
