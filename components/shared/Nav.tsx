"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";

import { SanityImage } from "@/components/shared/SanityImage";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import type { NavItem, SiteSettings } from "@/types";

function validNavItems(items: NavItem[]) {
  return items.filter(
    (item) => typeof item.href === "string" && item.href.length > 0 && item.label,
  );
}

export function Nav({ items, settings }: { items: NavItem[]; settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const phoneHref = settings.phone.replace(/\D/g, "");
  const navItems = validNavItems(items);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-brand-navy"
        >
          {settings.logo?.url ? (
            <SanityImage
              image={settings.logo}
              alt="Trade-In Solutions Irvine"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          ) : (
            "Trade-In Solutions"
          )}
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item, index) => (
              <NavigationMenuItem key={`${item.href}-${index}`}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="px-2 py-2 text-sm font-medium hover:text-brand-gold"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={`tel:${phoneHref}`}
            onClick={() => trackPhoneClick("nav")}
            className="flex items-center gap-1 text-sm font-semibold text-brand-navy hover:text-brand-gold"
          >
            <Phone className="h-4 w-4" />
            {settings.phone}
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
            onClick={() => trackCtaClick("nav_appraisal")}
          >
            <Link href="/schedule-appointment/">Get a Free Appraisal</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="mt-8 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className="text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`tel:${phoneHref}`}
                onClick={() => trackPhoneClick("mobile_nav")}
                className="font-semibold text-brand-gold"
              >
                {settings.phone}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
