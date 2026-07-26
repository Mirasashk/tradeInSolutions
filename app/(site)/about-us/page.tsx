import { ShieldCheck } from "lucide-react";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { CmsImage } from "@/components/shared/CmsImage";
import {
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TrustBadgesRow } from "@/components/sections/TrustBadgesRow";
import { buildMetadataFromCms } from "@/lib/seo";
import {
  getAboutPage,
  getSiteSettings,
  getTeamMembers,
  getTrustBadges,
} from "@/lib/cms/fetch";
import type { TeamMember } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "About Us",
    description:
      "Learn about Trade-In Solutions Irvine — 28+ years buying cars for cash in Orange County with a transparent, hassle-free process.",
    path: "/about-us/",
    settings,
  });
}

export default async function AboutPage() {
  const [about, team, trustBadges, settings] = await Promise.all([
    getAboutPage(),
    getTeamMembers(),
    getTrustBadges(),
    getSiteSettings(),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title={about?.heroTitle ?? "About Trade-In Solutions Irvine"}
        subtitle="28+ years helping customers sell their cars for cash — hassle free."
      />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="lg:sticky lg:top-28">
            <SectionEyebrow>Our Story</SectionEyebrow>
            <h2 className="mt-3 text-balance text-3xl font-bold text-brand-navy md:text-4xl">
              Built by Listening to What Car Sellers Actually Want
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="text-base leading-8 text-muted-foreground">
              {about?.story ? (
                <PortableTextContent value={about.story} />
              ) : (
                <p>
                  Trade-In Solutions Irvine has helped thousands of customers sell their
                  cars for cash with a transparent, hassle-free process.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <ProcessTimeline />

      <section className="px-4 py-20">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-brand-navy px-6 py-12 text-white md:px-14">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:gap-10">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold">
                <ShieldCheck className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Our Confidence Guarantee
                </h2>
                <div className="mt-4 leading-7 text-white/80">
                  {about?.confidenceGuarantee ? (
                    <PortableTextContent value={about.confidenceGuarantee} />
                  ) : (
                    <p>
                      We&apos;re so confident in our offers — go to a traditional dealer
                      first, get a written offer, then bring it to us.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {(team as TeamMember[]).length ? (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <Reveal className="text-center">
            <SectionEyebrow>Our Team</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
              Meet Our Appraisers
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(team as TeamMember[]).map((member) => (
              <StaggerItem key={member._id} className="h-full">
                <div className="group h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                  {member.photo ? (
                    <div className="overflow-hidden">
                      <CmsImage
                        image={member.photo}
                        alt={member.name}
                        width={400}
                        height={300}
                        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-brand-navy">
                      {member.name}
                    </h3>
                    {member.role ? (
                      <p className="mt-0.5 text-sm font-medium text-brand-gold">
                        {member.role}
                      </p>
                    ) : null}
                    {member.bio ? (
                      <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                    ) : null}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      <TrustBadgesRow badges={trustBadges} />

      <FinalCta phone={settings.phone} />
    </div>
  );
}
