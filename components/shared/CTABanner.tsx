import Link from "next/link";

import type { SiteSettings } from "@/types";

export function CTABanner({ settings }: { settings: SiteSettings }) {
  const text = settings.ctaBannerText ?? `Call ${settings.phone} today`;
  const phoneHref = settings.phone.replace(/\D/g, "");

  return (
    <section className="bg-brand-navy px-4 py-8 text-center text-white">
      <p className="text-lg font-semibold md:text-xl">{text}</p>
      <Link
        href={`tel:${phoneHref}`}
        className="mt-4 inline-block rounded-md bg-brand-gold px-6 py-3 font-semibold text-brand-navy"
      >
        Call {settings.phone}
      </Link>
    </section>
  );
}
