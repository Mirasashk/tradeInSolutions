"use client";

import Link from "next/link";

import { SanityImage } from "@/components/shared/SanityImage";
import { Separator } from "@/components/ui/separator";
import { trackOutboundClick, trackPhoneClick } from "@/lib/analytics";
import type { NavItem, SiteSettings } from "@/types";

export function Footer({
  settings,
  navItems,
}: {
  settings: SiteSettings;
  navItems: NavItem[];
}) {
  const phoneHref = settings.phone.replace(/\D/g, "");
  const links = navItems.filter(
    (item) => typeof item.href === "string" && item.href.length > 0 && item.label,
  );
  const footerLogo = settings.footerLogo?.url ? settings.footerLogo : settings.logo;

  return (
    <footer className="border-t bg-brand-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          {footerLogo?.url ? (
            <SanityImage
              image={footerLogo}
              alt="Trade-In Solutions Irvine"
              width={160}
              height={48}
              className="mb-3 h-10 w-auto"
            />
          ) : (
            <p className="text-lg font-bold">Trade-In Solutions Irvine</p>
          )}
          {settings.tagline ? (
            <p className="mt-1 text-sm text-white/70">{settings.tagline}</p>
          ) : null}
          <p className="mt-3 text-sm text-white/80">{settings.address}</p>
          <p className="mt-2 text-sm">
            <Link
              href={`tel:${phoneHref}`}
              onClick={() => trackPhoneClick("footer")}
              className="hover:text-brand-gold"
            >
              {settings.phone}
            </Link>
          </p>
          <p className="text-sm">
            <Link href={`mailto:${settings.email}`} className="hover:text-brand-gold">
              {settings.email}
            </Link>
          </p>
          <p className="mt-2 text-sm text-white/80">{settings.hours}</p>
          <div className="mt-4 flex gap-3">
            {settings.yelpUrl ? (
              <Link
                href={settings.yelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("yelp_footer")}
                className="text-sm hover:text-brand-gold"
              >
                Yelp
              </Link>
            ) : null}
            {settings.googleUrl ? (
              <Link
                href={settings.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("google_footer")}
                className="text-sm hover:text-brand-gold"
              >
                Google
              </Link>
            ) : null}
            {settings.facebookUrl ? (
              <Link
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("facebook_footer")}
                className="text-sm hover:text-brand-gold"
              >
                Facebook
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <p className="font-semibold">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((item, index) => (
              <li key={`${item.href}-${index}`}>
                <Link href={item.href} className="text-white/80 hover:text-brand-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/privacy-policy/"
                className="text-white/80 hover:text-brand-gold"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="bg-white/20" />
      <p className="px-4 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Trade-In Solutions Irvine. All rights reserved.
      </p>
    </footer>
  );
}
