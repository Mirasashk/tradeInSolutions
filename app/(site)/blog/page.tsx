import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { getBlogPosts } from "@/lib/sanity/fetch";
import type { BlogPostSummary } from "@/types";

export const metadata = buildMetadata({
  title: "Blog",
  path: "/blog/",
});

export default async function BlogPage() {
  const posts = (await getBlogPosts()) as BlogPostSummary[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">Blog</h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Blog posts will appear here once published in Sanity CMS.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post._id} className="border-b pb-6">
              <Link
                href={`/blog/${post.slug}/`}
                className="text-xl font-semibold hover:text-brand-gold"
              >
                {post.title}
              </Link>
              {post.excerpt ? (
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
