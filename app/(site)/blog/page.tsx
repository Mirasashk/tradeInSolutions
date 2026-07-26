import { BlogListing } from "@/components/sections/BlogListing";
import { LeadMagnetCard } from "@/components/sections/LeadMagnetCard";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/shared/motion";
import { buildMetadataFromCms } from "@/lib/seo";
import { getBlogPosts, getLeadMagnet, getSiteSettings } from "@/lib/cms/fetch";
import type { BlogPostSummary } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Blog",
    description:
      "Tips on selling your car, maintenance, and used-car market trends from the experts at Trade-In Solutions Irvine.",
    path: "/blog/",
    settings,
  });
}

export default async function BlogPage() {
  const [posts, leadMagnet] = await Promise.all([getBlogPosts(), getLeadMagnet()]);

  return (
    <div>
      <PageHero
        eyebrow="Blog"
        title="Car Selling Tips & Insights"
        subtitle="Advice on selling your car, maintenance, and market trends — from 28+ years in the business."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-start gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BlogListing posts={posts as BlogPostSummary[]} />
          </div>
          <Reveal delay={0.15} className="lg:sticky lg:top-28">
            <LeadMagnetCard leadMagnet={leadMagnet as never} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
