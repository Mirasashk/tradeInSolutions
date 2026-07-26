import { ValueEstimatorForm } from "@/components/forms/ValueEstimatorForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { buildMetadataFromCms } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms/fetch";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "What's My Car Worth?",
    description:
      "Get a rough estimate of your vehicle value in Irvine and Orange County.",
    path: "/value-estimator/",
    settings,
  });
}

export default function ValueEstimatorPage() {
  return (
    <div>
      <HeroSection
        title="What's My Car Worth?"
        subtitle="Enter your vehicle details for a rough estimate range — then schedule a free appraisal for an exact offer."
      />
      <div className="mx-auto max-w-xl px-4 py-16">
        <ValueEstimatorForm />
      </div>
    </div>
  );
}
