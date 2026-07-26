import Link from "next/link";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { CalendlyEmbed } from "@/components/sections/CalendlyEmbed";
import { DocumentChecklist } from "@/components/sections/DocumentChecklist";
import { HeroSection } from "@/components/sections/HeroSection";
import { LocationsSidebar } from "@/components/sections/LocationsSidebar";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { WhyUsGrid } from "@/components/sections/WhyUsGrid";
import { YelpBadge } from "@/components/sections/YelpBadge";
import { buildMetadataFromCms } from "@/lib/seo";
import { getAppointmentPage, getLocations, getSiteSettings } from "@/lib/cms/fetch";
import type { Location } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Schedule Appointment",
    description: "Schedule your free car appraisal in Irvine and Orange County.",
    path: "/schedule-appointment/",
    settings,
  });
}

export default async function ScheduleAppointmentPage() {
  const [appointmentPage, locations, settings] = await Promise.all([
    getAppointmentPage(),
    getLocations(),
    getSiteSettings(),
  ]);

  return (
    <div>
      <HeroSection
        title={
          appointmentPage?.heroTitle ??
          "Selling Your Vehicle? Experience a Hassle-Free way to get the highest value!"
        }
        subtitle={appointmentPage?.heroSubtitle ?? "We Will Buy Your Car Today"}
      />

      <ProcessSteps large />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-brand-navy">
              Request an Appointment
            </h2>
            <div className="mt-6">
              <AppointmentForm />
            </div>
          </section>

          <DocumentChecklist
            owned={appointmentPage?.checklistOwned ?? []}
            financed={appointmentPage?.checklistFinanced ?? []}
            leased={appointmentPage?.checklistLeased ?? []}
          />
        </div>

        <LocationsSidebar locations={locations as Location[]} />
      </div>

      <WhyUsGrid cards={appointmentPage?.whyUsCards ?? []} />
      <YelpBadge yelpUrl={settings.yelpUrl} rating={settings.yelpRating} />
      <CalendlyEmbed url={settings.calendlyUrl} />

      <section className="mx-auto max-w-2xl px-4 pb-16 text-center">
        <p className="text-muted-foreground">
          Prefer to talk?{" "}
          <Link href="tel:8884272302" className="font-semibold text-brand-gold">
            Call {settings.phone}
          </Link>
        </p>
      </section>
    </div>
  );
}
