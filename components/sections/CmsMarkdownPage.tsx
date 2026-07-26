import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { Reveal } from "@/components/shared/motion";
import { getPageBySlug, getSiteSettings } from "@/lib/cms/fetch";
import { buildMetadataFromCms } from "@/lib/seo";
import type { PageContent } from "@/types";

type CmsPageMetadataOptions = {
  slug: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
};

export async function generateCmsPageMetadata({
  slug,
  path,
  fallbackTitle,
  fallbackDescription,
}: CmsPageMetadataOptions): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)]);

  return buildMetadataFromCms({
    title: page?.title ?? fallbackTitle,
    description: fallbackDescription,
    seoTitle: page?.seoTitle,
    seoDescription: page?.seoDescription,
    path,
    settings,
  });
}

type CmsMarkdownPageProps = {
  slug: string;
  eyebrow: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackBody?: string;
};

/** Shared layout for CMS markdown pages: PageHero, body, FinalCta. */
export async function CmsMarkdownPage({
  slug,
  eyebrow,
  fallbackTitle,
  fallbackSubtitle,
  fallbackBody,
}: CmsMarkdownPageProps) {
  const [page, settings] = await Promise.all([
    getPageBySlug(slug) as Promise<PageContent | null>,
    getSiteSettings(),
  ]);

  const title = page?.title ?? fallbackTitle;
  const body = page?.body ?? fallbackBody;

  return (
    <div>
      <PageHero eyebrow={eyebrow} title={title} subtitle={fallbackSubtitle} />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Reveal>
          <div className="leading-7 text-muted-foreground">
            {body ? <PortableTextContent value={body} /> : <p>Content coming soon.</p>}
          </div>
        </Reveal>
      </section>
      <FinalCta phone={settings.phone} />
    </div>
  );
}
