import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { getTestimonials } from "@/lib/sanity/fetch";
import type { Testimonial } from "@/types";

export const metadata = buildMetadata({
  title: "Testimonials",
  path: "/testimonials/",
});

const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Sarah M.",
    location: "Irvine, CA",
    carModel: "2020 Honda Accord",
    quote: "Fast, fair, and professional. I had a check in hand the same day.",
  },
  {
    _id: "2",
    name: "James L.",
    location: "Tustin, CA",
    carModel: "2018 Toyota Camry",
    quote: "They beat my other offers and made the process incredibly easy.",
  },
];

export default async function TestimonialsPage() {
  const testimonials = (await getTestimonials()) as Testimonial[];
  const items = testimonials.length ? testimonials : fallbackTestimonials;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Customer Testimonials</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {[item.location, item.carModel].filter(Boolean).join(" • ")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
