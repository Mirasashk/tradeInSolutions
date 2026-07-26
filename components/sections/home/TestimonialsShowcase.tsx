"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

import { Reveal, SectionEyebrow } from "@/components/shared/motion";
import type { Testimonial } from "@/types";

const ROTATE_MS = 6000;

export function TestimonialsShowcase({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const visible = testimonials.slice(0, 6);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (next: number) => setIndex((next + visible.length) % visible.length),
    [visible.length],
  );

  useEffect(() => {
    if (visible.length <= 1 || paused) return;
    const timer = setInterval(() => goTo(index + 1), ROTATE_MS);
    return () => clearInterval(timer);
  }, [visible.length, paused, index, goTo]);

  if (!visible.length) return null;

  const current = visible[index];
  const rating = Math.round(current.rating ?? 5);

  return (
    <section className="bg-brand-navy px-4 py-20 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            What Our Customers Say
          </h2>
        </Reveal>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote
            aria-hidden
            className="absolute -top-4 left-1/2 h-10 w-10 -translate-x-1/2 text-brand-gold/30"
          />
          <div className="min-h-56 md:min-h-48">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current._id}
                initial={{ opacity: 0, x: reduceMotion ? 0 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : -40 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="px-2 pt-8"
              >
                <p className="text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer className="mt-6">
                  <div
                    className="flex items-center justify-center gap-1 text-brand-gold"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 font-semibold">{current.name}</p>
                  <p className="text-sm text-white/60">
                    {[current.location, current.carModel].filter(Boolean).join(" • ")}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {visible.length > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {visible.map((t, i) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-brand-gold" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <Reveal delay={0.2} className="mt-8">
          <Link
            href="/testimonials/"
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            Read all testimonials →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
