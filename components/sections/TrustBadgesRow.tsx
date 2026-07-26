import Link from "next/link";

import { SanityImage } from "@/components/shared/SanityImage";
import type { TrustBadge as TrustBadgeType } from "@/types";

export function TrustBadgesRow({ badges }: { badges: TrustBadgeType[] }) {
  if (!badges.length) {
    const defaults = [
      "28+ Years in Business",
      "Licensed & Bonded",
      "Yelp 5-Star Rating",
      "Same-Day Payment",
    ];
    return (
      <section className="px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
          {defaults.map((label) => (
            <span
              key={label}
              className="rounded-full border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy"
            >
              {label}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
        {badges.map((badge) => {
          const content = (
            <span className="flex flex-col items-center gap-2 text-center">
              {badge.icon ? (
                <SanityImage
                  image={badge.icon}
                  alt={badge.label}
                  width={48}
                  height={48}
                />
              ) : null}
              <span className="text-sm font-medium text-brand-navy">{badge.label}</span>
            </span>
          );

          return badge.link ? (
            <Link
              key={badge._id}
              href={badge.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </Link>
          ) : (
            <span key={badge._id}>{content}</span>
          );
        })}
      </div>
    </section>
  );
}
