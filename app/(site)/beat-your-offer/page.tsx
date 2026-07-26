import { BeatOfferForm } from "@/components/forms/BeatOfferForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { buildMetadataFromCms } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms/fetch";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "We Beat Your Offer",
    description:
      "Submit a competitor offer — we will beat any written offer or give you $100.",
    path: "/beat-your-offer/",
    settings,
  });
}

export default function BeatYourOfferPage() {
  return (
    <div>
      <HeroSection
        title="We Beat Your Offer"
        subtitle="Bring us any written dealer offer. We'll beat it — or give you $100."
      />
      <div className="mx-auto max-w-xl px-4 py-16">
        <BeatOfferForm />
      </div>
    </div>
  );
}
