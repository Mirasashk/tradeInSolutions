import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { SanityImage } from "@/components/shared/SanityImage";
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

  const post = (await getBlogPostBySlug(slug)) as BlogPost | null;

  if (!post) {
    notFound();
  }

  const jsonLd = buildBlogPostingJsonLd(post);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {post.mainImage ? (
        <SanityImage
          image={post.mainImage}
          alt={post.title}
          width={900}
          height={500}
          className="mb-8 aspect-video w-full rounded-lg object-cover"
          priority
        />
      ) : null}
      <h1 className="text-4xl font-bold text-brand-navy">{post.title}</h1>
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
        {post.publishedAt ? (
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
        ) : null}
        {post.author ? <span>By {post.author}</span> : null}
        {post.category ? <span>{post.category}</span> : null}
      </div>
      <div className="mt-8">
        <PortableTextContent value={post.body} />
      </div>

      {post.relatedPosts?.length ? (
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-brand-navy">Related Posts</h2>
          <ul className="mt-4 space-y-2">
            {post.relatedPosts.map((related: BlogPostSummary) => (
              <li key={related._id}>
                <Link
                  href={`/blog/${related.slug}/`}
                  className="text-brand-gold hover:underline"
                >
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 rounded-lg bg-brand-navy p-8 text-center text-white">
        <p className="text-lg font-semibold">Ready to sell your car?</p>
        <Link
          href="/schedule-appointment/"
          className="mt-4 inline-block rounded-md bg-brand-gold px-6 py-3 font-semibold text-brand-navy"
        >
          Schedule an appointment
        </Link>
      </section>
    </article>
  );
}
