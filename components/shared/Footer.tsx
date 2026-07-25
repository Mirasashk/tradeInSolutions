import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import type { NavItem, SiteSettings } from "@/types";

export function Footer({
  settings,
  navItems,
}: {
  settings: SiteSettings;
  navItems: NavItem[];
}) {
  const phoneHref = settings.phone.replace(/\D/g, "");

  return (
    <footer className="border-t bg-brand-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Trade-In Solutions Irvine</p>
          <p className="mt-2 text-sm text-white/80">{settings.address}</p>
          <p className="mt-2 text-sm">
            <Link href={`tel:${phoneHref}`} className="hover:text-brand-gold">
              {settings.phone}
            </Link>
          </p>
          <p className="text-sm">
            <Link href={`mailto:${settings.email}`} className="hover:text-brand-gold">
              {settings.email}
            </Link>
          </p>
          <p className="mt-2 text-sm text-white/80">{settings.hours}</p>
        </div>

        <div>
          <p className="font-semibold">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
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
