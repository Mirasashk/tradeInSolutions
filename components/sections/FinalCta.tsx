"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

import { Reveal } from "@/components/shared/motion";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";

export function FinalCta({ phone }: { phone: string }) {
  const phoneHref = `tel:${phone.replace(/\D/g, "")}`;

  return (
    <section className="px-4 py-20">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-navy px-6 py-16 text-center text-white md:px-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">
              Ready to Sell Your Car Today?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Get the highest value for your car — fast, easy, and fair. Free appraisal,
              no obligation, and same-day payment if you accept.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/schedule-appointment/"
                onClick={() => trackCtaClick("final_cta_appointment")}
                className="rounded-md bg-brand-gold px-8 py-3.5 text-base font-semibold text-brand-navy shadow-lg shadow-brand-gold/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Your Free Appraisal
              </Link>
              <Link
                href={phoneHref}
                onClick={() => trackPhoneClick("final_cta")}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <Phone className="h-4 w-4" />
                Call {phone}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
