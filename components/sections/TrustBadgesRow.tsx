"use client";

import Link from "next/link";
import { Award, BadgeCheck, ShieldCheck, Star, Trophy, Wallet } from "lucide-react";

import { CmsImage } from "@/components/shared/CmsImage";
import {
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import type { TrustBadge } from "@/types";

const FALLBACK_BADGES: TrustBadge[] = [
  { _id: "fallback-years", label: "28+ Years of Automotive Experience" },
  {
    _id: "fallback-yelp",
    label: "4.5 Stars on Yelp — 100+ Reviews",
    link: "https://www.yelp.com/biz/trade-in-solutions-irvine",
  },
  { _id: "fallback-broker", label: "Top 3 Auto Broker in Irvine — BusinessRate 2025" },
  { _id: "fallback-payment", label: "Same-Day Payment" },
  { _id: "fallback-guarantee", label: "Offers Good for 7 Days or 350 Miles" },
];

function badgeKey(badge: TrustBadge, index: number): string {
  return badge._id || badge.label || String(index);
}

function BadgeIcon({ badge }: { badge: TrustBadge }) {
  if (badge.icon?.url) {
    return (
      <CmsImage
        image={badge.icon}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    );
  }

  const text = badge.label.toLowerCase();

  if (text.includes("yelp") || text.includes("star") || text.includes("review")) {
    return <Star className="h-5 w-5" aria-hidden />;
  }
  if (text.includes("year") || text.includes("experience")) {
    return <Award className="h-5 w-5" aria-hidden />;
  }
  if (text.includes("broker") || text.includes("top")) {
    return <Trophy className="h-5 w-5" aria-hidden />;
  }
  if (text.includes("payment") || text.includes("same-day")) {
    return <Wallet className="h-5 w-5" aria-hidden />;
  }
  if (text.includes("licensed") || text.includes("bonded")) {
    return <ShieldCheck className="h-5 w-5" aria-hidden />;
  }

  return <BadgeCheck className="h-5 w-5" aria-hidden />;
}

function TrustBadgeCard({ badge }: { badge: TrustBadge }) {
  const card = (
    <div className="group flex h-full flex-col items-center rounded-2xl border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-md">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
        <BadgeIcon badge={badge} />
      </span>
      <p className="mt-3 text-sm font-semibold leading-snug text-brand-navy">
        {badge.label}
      </p>
    </div>
  );

  if (badge.link) {
    return (
      <Link
        href={badge.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </Link>
    );
  }

  return card;
}

export function TrustBadgesRow({ badges = [] }: { badges?: TrustBadge[] }) {
  const items = badges.length ? badges : FALLBACK_BADGES;

  return (
    <section className="bg-muted/40 px-4 py-16 md:py-20" aria-label="Trust badges">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <SectionEyebrow>Trusted &amp; Verified</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-bold text-brand-navy md:text-3xl">
            Why Customers Choose Us
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((badge, index) => (
            <StaggerItem key={badgeKey(badge, index)} className="h-full">
              <TrustBadgeCard badge={badge} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
