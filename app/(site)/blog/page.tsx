import { BlogListing } from "@/components/sections/BlogListing";
import { LeadMagnetCard } from "@/components/sections/LeadMagnetCard";
import { buildMetadataFromCms } from "@/lib/seo";
import { getBlogPosts, getLeadMagnet, getSiteSettings } from "@/lib/cms/fetch";
import type { BlogPostSummary } from "@/types";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadataFromCms({
    title: "Blog",
    description:
      "Tips on selling your car, maintenance, and market trends from Trade-In Solutions.",
    path: "/blog/",
    settings,
  });
}

export default async function BlogPage() {
  const [posts, leadMagnet] = await Promise.all([getBlogPosts(), getLeadMagnet()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-brand-navy">Blog</h1>
          <BlogListing posts={posts as BlogPostSummary[]} />
        </div>
        <LeadMagnetCard leadMagnet={leadMagnet as never} />
      </div>
    </div>
  );
}
