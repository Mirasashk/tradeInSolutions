"use client";

export function SocialProofTicker({ items }: { items: string[] }) {
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <section className="overflow-hidden bg-brand-navy py-3 text-white">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="mx-8 text-sm font-medium">
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
