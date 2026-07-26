import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Location } from "@/types";

export function LocationsSidebar({ locations }: { locations: Location[] }) {
  return (
    <aside className="space-y-4">
      <h3 className="text-lg font-semibold text-brand-navy">Our Locations</h3>
      {locations.slice(0, 3).map((location) => (
        <Card key={location._id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{location.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{location.address}</p>
            {location.isFieldAppraisalOnly ? (
              <p className="mt-1 italic">Field Appraisal Only</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
      <Link
        href="/branch-locations/"
        className="text-sm font-medium text-brand-gold hover:underline"
      >
        View all locations →
      </Link>
    </aside>
  );
}
