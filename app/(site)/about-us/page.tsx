import Link from "next/link";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { SanityImage } from "@/components/shared/SanityImage";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { TrustBadgesRow } from "@/components/sections/TrustBadgesRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadataFromCms } from "@/lib/seo";
import {
  getAboutPage,
  getTeamMembers,
  getTrustBadges,
  getSiteSettings,
} from "@/lib/cms/fetch";
import type { TeamMember } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "About Us",
    description:
      "Learn about Trade-In Solutions Irvine — 28+ years buying cars for cash.",
    path: "/about-us/",
    settings,
  });
}

export default async function AboutPage() {
  const [about, team, trustBadges] = await Promise.all([
    getAboutPage(),
    getTeamMembers(),
    getTrustBadges(),
  ]);

  return (
    <div>
      <HeroSection
        title={about?.heroTitle ?? "About Trade-In Solutions Irvine"}
        subtitle="28+ years helping customers sell their cars for cash — hassle free."
      />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-brand-navy">Our Story</h2>
        <div className="mt-6 leading-7 text-muted-foreground">
          {about?.story ? (
            <PortableTextContent value={about.story} />
          ) : (
            <p>
              Trade-In Solutions Irvine has helped thousands of customers sell their
              cars for cash with a transparent, hassle-free process.
            </p>
          )}
        </div>
      </section>

      <ProcessSteps />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-brand-navy">Our Confidence Guarantee</h2>
        <div className="mt-6 leading-7 text-muted-foreground">
          {about?.confidenceGuarantee ? (
            <PortableTextContent value={about.confidenceGuarantee} />
          ) : (
            <p>
              We&apos;re so confident in our offers — go to a traditional dealer first,
              get a written offer, then bring it to us.
            </p>
          )}
        </div>
      </section>

      {(team as TeamMember[]).length ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold text-brand-navy">
            Meet Our Team
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(team as TeamMember[]).map((member) => (
              <Card key={member._id}>
                {member.photo ? (
                  <SanityImage
                    image={member.photo}
                    alt={member.name}
                    width={400}
                    height={300}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                ) : null}
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  {member.role ? (
                    <p className="text-sm text-brand-gold">{member.role}</p>
                  ) : null}
                </CardHeader>
                {member.bio ? (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <TrustBadgesRow badges={trustBadges as never[]} />

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">
          Don&apos;t wait — call today to make an appointment.
        </p>
        <Button asChild className="mt-6 bg-brand-gold text-brand-navy">
          <Link href="/schedule-appointment/">Schedule Your Appraisal</Link>
        </Button>
      </section>
    </div>
  );
}
