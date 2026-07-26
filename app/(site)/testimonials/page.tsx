import { StarRating } from "@/components/shared/StarRating";
import { YelpBadge } from "@/components/sections/YelpBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadataFromCms, buildReviewJsonLd } from "@/lib/seo";
import { getSiteSettings, getTestimonials } from "@/lib/cms/fetch";
import type { Testimonial } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Testimonials",
    description:
      "Read reviews from customers who sold their cars to Trade-In Solutions Irvine.",
    path: "/testimonials/",
    settings,
  });
}

const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Sarah M.",
    location: "Irvine, CA",
    carModel: "2020 Honda Accord",
    quote: "Fast, fair, and professional. I had a check in hand the same day.",
    rating: 5,
  },
];

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    getTestimonials(),
    getSiteSettings(),
  ]);
  const items = (testimonials as Testimonial[]).length
    ? (testimonials as Testimonial[])
    : fallbackTestimonials;
  const jsonLd = buildReviewJsonLd(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <YelpBadge yelpUrl={settings.yelpUrl} rating={settings.yelpRating} />

      <h1 className="mt-8 text-4xl font-bold text-brand-navy">Customer Testimonials</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {item.rating ? <StarRating rating={item.rating} /> : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {[item.location, item.carModel].filter(Boolean).join(" • ")}
              </p>
              {item.publishedAt ? (
                <p className="text-xs text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </p>
              ) : null}
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
              {item.videoUrl ? (
                <div className="mt-4 aspect-video">
                  <iframe
                    src={item.videoUrl.includes("embed") ? item.videoUrl : undefined}
                    title={`${item.name} testimonial`}
                    className="h-full w-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
