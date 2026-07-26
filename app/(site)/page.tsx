import Link from "next/link";

import { BulletSection } from "@/components/sections/BulletSection";
import { HeroSection, VideoHeroEmbed } from "@/components/sections/HeroSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { QuickActionsGrid } from "@/components/sections/QuickActionsGrid";
import { SocialProofTicker } from "@/components/sections/SocialProofTicker";
import { StatsTrustBar } from "@/components/sections/StatsTrustBar";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { TrustBadgesRow } from "@/components/sections/TrustBadgesRow";
import { YelpBadge } from "@/components/sections/YelpBadge";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { Button } from "@/components/ui/button";
import { buildMetadataFromCms } from "@/lib/seo";
import {
  getCaseStudies,
  getHomePage,
  getSiteSettings,
  getSocialProofItems,
  getTestimonials,
  getTrustBadges,
} from "@/lib/cms/fetch";
import type { SocialProofItem, Testimonial } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Sell Your Car for Cash in Irvine",
    description:
      "Free appraisal, same-day payment, and a hassle-free car selling experience in Orange County.",
    path: "/",
    settings,
  });
}

export default async function HomePage() {
  const [home, settings, testimonials, trustBadges, caseStudies, socialProof] =
    await Promise.all([
      getHomePage(),
      getSiteSettings(),
      getTestimonials(6),
      getTrustBadges(),
      getCaseStudies(),
      getSocialProofItems(),
    ]);

  const tickerItems =
    home.socialProofItems ??
    (socialProof as SocialProofItem[]).map((item) => item.text);

  return (
    <div>
      {tickerItems.length ? <SocialProofTicker items={tickerItems} /> : null}

      <HeroSection
        title={home.heroHeadline ?? ""}
        subtitle={home.heroSubheadline}
        backgroundImage={home.heroImage}
        videoUrl={home.videoUrl}
      >
        <Button
          asChild
          size="lg"
          className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
        >
          <Link href={home.heroPrimaryCtaHref ?? "/schedule-appointment/"}>
            {home.heroPrimaryCtaLabel ?? "Get Your Free Appraisal"}
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white text-white hover:bg-white/10"
        >
          <Link href={home.heroSecondaryCtaHref ?? "tel:8884272302"}>
            {home.heroSecondaryCtaLabel ?? "Call (888) 427-2302"}
          </Link>
        </Button>
      </HeroSection>

      {home.videoUrl ? (
        <div className="bg-brand-navy px-4 pb-12">
          <VideoHeroEmbed url={home.videoUrl} title={home.heroHeadline ?? "Video"} />
        </div>
      ) : null}

      <QuickActionsGrid />

      <BulletSection
        headline={
          home.whySellHeadline ?? "Why Should I Sell My Car to Trade-In Solutions?"
        }
        bullets={home.whySellBullets ?? []}
      />

      <BulletSection
        id="compare-offers"
        headline={home.compareHeadline ?? "Compare Other Offers to Trade-In Solutions"}
        bullets={home.compareBullets ?? []}
      />

      <StatsTrustBar />
      <ProcessSteps />
      <TestimonialsSlider testimonials={testimonials as Testimonial[]} />
      <TrustBadgesRow badges={trustBadges as never[]} />
      <CaseStudiesSection caseStudies={caseStudies as never[]} />
      <YelpBadge yelpUrl={settings.yelpUrl} rating={settings.yelpRating} />
    </div>
  );
}
