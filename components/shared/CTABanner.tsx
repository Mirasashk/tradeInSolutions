"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackPhoneClick } from "@/lib/analytics";
import type { SiteSettings } from "@/types";

export function CTABanner({
  settings,
  sticky = true,
}: {
  settings: SiteSettings;
  sticky?: boolean;
}) {
  const [visible, setVisible] = useState(!sticky);
  const text =
    settings.ctaBannerText ?? `GOT QUESTIONS? CONTACT US AT ${settings.phone}`;
  const phoneHref = settings.phone.replace(/\D/g, "");

  useEffect(() => {
    if (!sticky) return;

    function onScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  if (sticky && !visible) return null;

  return (
    <section
      className={`bg-brand-navy px-4 py-4 text-center text-white ${
        sticky ? "fixed bottom-0 left-0 right-0 z-40 shadow-lg" : "py-8"
      }`}
    >
      <p className="text-sm font-semibold md:text-lg">{text}</p>
      <Link
        href={`tel:${phoneHref}`}
        onClick={() => trackPhoneClick("cta_banner")}
        className="mt-2 inline-block rounded-md bg-brand-gold px-6 py-2 text-sm font-semibold text-brand-navy md:mt-4 md:py-3"
      >
        Call {settings.phone}
      </Link>
    </section>
  );
}
