"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import {
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { trackCtaClick } from "@/lib/analytics";

type WhySellSectionProps = {
  whySellHeadline: string;
  whySellBullets: string[];
  compareHeadline: string;
  compareBullets: string[];
};

export function WhySellSection({
  whySellHeadline,
  whySellBullets,
  compareHeadline,
  compareBullets,
}: WhySellSectionProps) {
  return (
    <section className="bg-muted/40 px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Why sell to us */}
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <SectionEyebrow>Why Trade-In Solutions</SectionEyebrow>
            <h2 className="mt-3 text-balance text-3xl font-bold text-brand-navy md:text-4xl">
              {whySellHeadline}
            </h2>
          </Reveal>

          <Stagger className="mt-8 space-y-4">
            {whySellBullets.map((bullet) => (
              <StaggerItem key={bullet} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                <span className="text-base text-foreground/80">{bullet}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-8">
            <Link
              href="/schedule-appointment/"
              onClick={() => trackCtaClick("why_sell_appointment")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
            >
              Schedule your free appraisal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Compare offers card */}
        <Reveal delay={0.15}>
          <div
            id="compare-offers"
            className="scroll-mt-28 rounded-2xl border bg-card p-8 shadow-sm md:p-10"
          >
            <h3 className="text-balance text-2xl font-bold text-brand-navy">
              {compareHeadline}
            </h3>
            <Stagger className="mt-6 space-y-4">
              {compareBullets.map((bullet, i) => (
                <StaggerItem key={bullet} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-bold text-brand-gold">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {bullet}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-8 rounded-lg bg-brand-navy/5 p-4 text-sm text-foreground/70">
              Already have a written offer from a dealer? Bring it in — we&apos;re
              confident we can beat it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
