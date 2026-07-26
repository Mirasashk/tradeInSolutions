import { Star } from "lucide-react";

import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { TestimonialsGrid } from "@/components/sections/TestimonialsGrid";
import { YelpBadge } from "@/components/sections/YelpBadge";
import { buildMetadataFromCms, buildReviewJsonLd } from "@/lib/seo";
import { getSiteSettings, getTestimonials } from "@/lib/cms/fetch";
import type { Testimonial } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Testimonials",
    description:
      "Read reviews from customers across Orange County, Los Angeles, and San Diego who sold their cars to Trade-In Solutions Irvine.",
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
    <div>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <PageHero
        eyebrow="Testimonials"
        title="What Our Customers Say"
        subtitle="Real reviews from real sellers across Orange County, Los Angeles, and San Diego."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur">
          <span className="flex items-center gap-0.5 text-brand-gold">
            {Array.from({ length: Math.round(settings.yelpRating ?? 5) }).map(
              (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ),
            )}
          </span>
          People Love Us on Yelp
        </span>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <TestimonialsGrid testimonials={items} />
        <div className="mt-12">
          <YelpBadge yelpUrl={settings.yelpUrl} rating={settings.yelpRating} />
        </div>
      </div>

      <FinalCta phone={settings.phone} />
    </div>
  );
}
