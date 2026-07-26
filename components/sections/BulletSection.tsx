import { CheckCircle2 } from "lucide-react";

export function BulletSection({
  headline,
  bullets,
  id,
}: {
  headline: string;
  bullets: string[];
  id?: string;
}) {
  if (!bullets.length) return null;

  return (
    <section id={id} className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-brand-navy">{headline}</h2>
      <ul className="mt-8 space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
            <span className="text-muted-foreground">{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
