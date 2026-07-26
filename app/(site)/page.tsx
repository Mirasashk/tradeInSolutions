import { VideoHeroEmbed } from "@/components/sections/HeroSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { SocialProofTicker } from "@/components/sections/SocialProofTicker";
import { TrustBadgesRow } from "@/components/sections/TrustBadgesRow";
import { YelpBadge } from "@/components/sections/YelpBadge";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { QuickActions } from "@/components/sections/home/QuickActions";
import { StatsCounters } from "@/components/sections/home/StatsCounters";
import { TestimonialsShowcase } from "@/components/sections/home/TestimonialsShowcase";
import { WhySellSection } from "@/components/sections/home/WhySellSection";
import { Reveal, SectionEyebrow } from "@/components/shared/motion";
import { buildMetadataFromCms } from "@/lib/seo";
import { defaultHomePage } from "@/lib/cms/defaults";
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
    title: "Sell My Car for Cash in Irvine & Orange County",
    description:
      "Sell your car today, hassle free. Free expert appraisal, fair market-based offers, and same-day payment in 45 minutes or less. Serving Irvine, Orange County, Los Angeles & San Diego.",
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
      <HomeHero
        headline={home.heroHeadline ?? defaultHomePage.heroHeadline!}
        subheadline={home.heroSubheadline}
        backgroundImage={home.heroImage}
        primaryCtaLabel={home.heroPrimaryCtaLabel ?? "Get Your Free Appraisal"}
        primaryCtaHref={home.heroPrimaryCtaHref ?? "/schedule-appointment/"}
        secondaryCtaLabel={home.heroSecondaryCtaLabel ?? `Call ${settings.phone}`}
        secondaryCtaHref={home.heroSecondaryCtaHref ?? "tel:8884272302"}
      />

      {tickerItems.length ? <SocialProofTicker items={tickerItems} /> : null}

      <QuickActions />

      <WhySellSection
        whySellHeadline={home.whySellHeadline ?? defaultHomePage.whySellHeadline!}
        whySellBullets={home.whySellBullets ?? defaultHomePage.whySellBullets!}
        compareHeadline={home.compareHeadline ?? defaultHomePage.compareHeadline!}
        compareBullets={home.compareBullets ?? defaultHomePage.compareBullets!}
      />

      <StatsCounters />

      <ProcessTimeline />

      {home.videoUrl ? (
        <section className="px-4 pb-20">
          <Reveal className="text-center">
            <SectionEyebrow>Watch</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
              See the Process for Yourself
            </h2>
            <VideoHeroEmbed
              url={home.videoUrl}
              title={home.heroHeadline ?? "How it works"}
            />
          </Reveal>
        </section>
      ) : null}

      <TestimonialsShowcase testimonials={testimonials as Testimonial[]} />

      <CaseStudiesSection caseStudies={caseStudies as never[]} />

      <TrustBadgesRow badges={trustBadges} />
      <YelpBadge yelpUrl={settings.yelpUrl} rating={settings.yelpRating} />

      <FinalCta phone={settings.phone} />
    </div>
  );
}
