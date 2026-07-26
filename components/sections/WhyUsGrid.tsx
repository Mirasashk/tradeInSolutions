import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WhyUsCard } from "@/types";

export function WhyUsGrid({ cards }: { cards: WhyUsCard[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-brand-navy">Why Choose Us</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
