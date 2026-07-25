import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { getLocations } from "@/lib/sanity/fetch";
import type { Location } from "@/types";

export const metadata = buildMetadata({
  title: "Branch Locations",
  path: "/branch-locations/",
});

const fallbackLocations: Location[] = [
  {
    _id: "1",
    name: "Irvine Office",
    address: "Irvine, CA",
    phone: "(888) 427-2302",
    hours: "Mon–Sat 9am–6pm",
  },
];

export default async function LocationsPage() {
  const locations = (await getLocations()) as Location[];
  const items = locations.length ? locations : fallbackLocations;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Branch Locations</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {items.map((location) => (
          <Card key={location._id}>
            <CardHeader>
              <CardTitle>{location.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{location.address}</p>
              {location.phone ? <p>{location.phone}</p> : null}
              {location.hours ? <p>{location.hours}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
