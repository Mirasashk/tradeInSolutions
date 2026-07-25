import { notFound } from "next/navigation";

import { PortableTextContent } from "@/components/shared/PortableTextContent";
import { buildMetadata } from "@/lib/seo";
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/sanity/fetch";
import type { BlogPost } from "@/types";

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

  if (slug === "placeholder") {
    return buildMetadata({ title: "Blog", path: "/blog/", noIndex: true });
  }

  const post = (await getBlogPostBySlug(slug)) as BlogPost | null;

  if (!post) {
    return buildMetadata({ title: "Blog Post", path: `/blog/${slug}/`, noIndex: true });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${slug}/`,
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">{post.title}</h1>
      {post.publishedAt ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      ) : null}
      <div className="mt-8">
        <PortableTextContent value={post.body} />
      </div>
    </article>
  );
}
