import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { CmsImage } from "@/components/shared/CmsImage";
import { Reveal } from "@/components/shared/motion";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildBlogPostingJsonLd, buildMetadata, buildMetadataFromCms } from "@/lib/seo";
import { getBlogPostBySlug, getBlogSlugs, getSiteSettings } from "@/lib/cms/fetch";
import type { BlogPost, BlogPostSummary } from "@/types";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  if (slugs.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSiteSettings();

  if (slug === "placeholder") {
    return buildMetadata({ title: "Blog", path: "/blog/", noIndex: true });
  }

  const post = (await getBlogPostBySlug(slug)) as BlogPost | null;

  if (!post) {
    return buildMetadataFromCms({
      title: "Blog Post",
      path: `/blog/${slug}/`,
      settings,
    });
  }

  return buildMetadataFromCms({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${slug}/`,
    settings,
    ogImage: post.mainImage,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "placeholder") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted-foreground">No blog posts published yet.</p>
      </div>
    );
  }

  const [post, settings] = await Promise.all([
    getBlogPostBySlug(slug) as Promise<BlogPost | null>,
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const jsonLd = buildBlogPostingJsonLd(post);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article header */}
      <header className="relative overflow-hidden bg-brand-navy px-4 py-16 text-white md:py-20">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-2/3 rounded-full bg-brand-gold/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {post.category ? (
              <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {post.category}
              </span>
            ) : null}
            {post.publishedAt ? (
              <time className="text-white/60">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
            {post.author ? (
              <span className="text-white/60">By {post.author}</span>
            ) : null}
          </div>
          <h1 className="mt-4 text-balance text-3xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {post.mainImage ? (
          <Reveal y={16} className="-mt-0 pt-10">
            <CmsImage
              image={post.mainImage}
              alt={post.title}
              width={900}
              height={500}
              className="aspect-video w-full rounded-2xl object-cover shadow-md"
              priority
            />
          </Reveal>
        ) : null}

        <div className="mt-10 leading-8 text-foreground/85">
          <PortableTextContent value={post.body} />
        </div>

        {post.relatedPosts?.length ? (
          <section className="mt-14 border-t pt-10">
            <h2 className="text-xl font-bold text-brand-navy">Related Articles</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {post.relatedPosts.map((related: BlogPostSummary) => (
                <Link
                  key={related._id}
                  href={`/blog/${related.slug}/`}
                  className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:shadow-md"
                >
                  <h3 className="font-semibold text-brand-navy transition-colors group-hover:text-brand-gold">
                    {related.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <FinalCta phone={settings.phone} />
    </div>
  );
}
