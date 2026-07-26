import Link from "next/link";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { SanityImage } from "@/components/shared/SanityImage";
import { GoogleMapEmbed } from "@/components/sections/GoogleMapEmbed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildLocationJsonLd, buildMetadataFromCms } from "@/lib/seo";
import { getLocations, getSiteSettings } from "@/lib/cms/fetch";
import type { Location } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Branch Locations",
    description:
      "Visit Trade-In Solutions in Irvine, West Los Angeles, and surrounding areas.",
    path: "/branch-locations/",
    settings,
  });
}

const fallbackLocations: Location[] = [
  {
    _id: "1",
    name: "Irvine / Orange County (Main)",
    address: "9891 Irvine Center Drive, Suite 200, Irvine, CA 92618",
    phone: "(888) 427-2302",
    phones: ["(949) 398-8232"],
    hours: "Mon–Sat 9am–6pm",
    locationType: "main",
  },
];

export default async function LocationsPage() {
  const [locations, settings] = await Promise.all([getLocations(), getSiteSettings()]);
  const items = (locations as Location[]).length
    ? (locations as Location[])
    : fallbackLocations;
  const jsonLd = buildLocationJsonLd(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold text-brand-navy">Branch Locations</h1>
      <div className="mt-8 space-y-12">
        {items.map((location) => (
          <article key={location._id} className="space-y-4">
            <Card>
              <div className="grid gap-6 md:grid-cols-2">
                {location.photo ? (
                  <SanityImage
                    image={location.photo}
                    alt={location.name}
                    width={600}
                    height={400}
                    className="h-56 w-full rounded-t-lg object-cover md:rounded-l-lg md:rounded-tr-none"
                  />
                ) : null}
                <div>
                  <CardHeader>
                    <CardTitle>{location.name}</CardTitle>
                    {location.isFieldAppraisalOnly ? (
                      <p className="text-sm font-medium text-brand-gold">
                        Field Appraisal Only — Our appraiser will come to you!
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{location.address}</p>
                    {location.phone ? <p>{location.phone}</p> : null}
                    {location.phones?.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {location.hours ? <p>{location.hours}</p> : null}
                    {location.note ? <p className="italic">{location.note}</p> : null}
                    {location.directions ? (
                      <div className="prose prose-sm max-w-none">
                        <PortableTextContent value={location.directions} />
                      </div>
                    ) : null}
                    <Button
                      asChild
                      size="sm"
                      className="mt-4 bg-brand-gold text-brand-navy"
                    >
                      <Link href="/schedule-appointment/">Schedule an Appointment</Link>
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
            <GoogleMapEmbed
              embedUrl={location.mapEmbedUrl ?? settings.mapEmbedUrl}
              title={`Map — ${location.name}`}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
