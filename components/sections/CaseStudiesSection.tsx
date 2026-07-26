import { SanityImage } from "@/components/shared/SanityImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CaseStudy } from "@/types";

export function CaseStudiesSection({ caseStudies }: { caseStudies: CaseStudy[] }) {
  if (!caseStudies.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-brand-navy">
        Before & After Case Studies
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((study) => (
          <Card key={study._id}>
            {study.photo ? (
              <SanityImage
                image={study.photo}
                alt={study.customerName ?? "Case study"}
                width={400}
                height={240}
                className="h-40 w-full rounded-t-lg object-cover"
              />
            ) : null}
            <CardHeader>
              <CardTitle className="text-lg">
                {[study.customerName, study.carModel].filter(Boolean).join(" — ")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {study.dealerOffer != null ? (
                <p>Dealer offer: ${study.dealerOffer.toLocaleString()}</p>
              ) : null}
              {study.ourOffer != null ? (
                <p className="font-semibold text-brand-gold">
                  We paid: ${study.ourOffer.toLocaleString()}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
