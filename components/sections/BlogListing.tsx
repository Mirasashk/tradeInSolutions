"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SanityImage } from "@/components/shared/SanityImage";
import type { BlogPostSummary } from "@/types";

const POSTS_PER_PAGE = 6;

export function BlogListing({ posts }: { posts: BlogPostSummary[] }) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[],
    [posts],
  );

  const filtered = useMemo(() => {
    if (!category) return posts;
    return posts.filter((p) => p.category === category);
  }, [posts, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  if (!posts.length) {
    return (
      <p className="mt-6 text-muted-foreground">
        Blog posts will appear here once published in Sanity CMS.
      </p>
    );
  }

  return (
    <>
      {categories.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCategory(null);
              setPage(1);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !category
                ? "border-brand-gold bg-brand-gold/10"
                : "hover:border-brand-gold"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                category === cat
                  ? "border-brand-gold bg-brand-gold/10"
                  : "hover:border-brand-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {pagePosts.map((post) => (
          <article key={post._id} className="group">
            {post.mainImage ? (
              <Link href={`/blog/${post.slug}/`}>
                <SanityImage
                  image={post.mainImage}
                  alt={post.title}
                  width={600}
                  height={340}
                  className="mb-4 aspect-video w-full rounded-lg object-cover"
                />
              </Link>
            ) : null}
            {post.category ? (
              <span className="text-xs font-medium uppercase text-brand-gold">
                {post.category}
              </span>
            ) : null}
            <Link
              href={`/blog/${post.slug}/`}
              className="mt-1 block text-xl font-semibold group-hover:text-brand-gold"
            >
              {post.title}
            </Link>
            {post.publishedAt ? (
              <time className="mt-1 block text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            ) : null}
            {post.excerpt ? (
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            ) : null}
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`rounded px-3 py-1 text-sm ${
                p === currentPage
                  ? "bg-brand-navy text-white"
                  : "border hover:border-brand-gold"
              }`}
            >
              {p}
            </button>
          ))}
        </nav>
      ) : null}
    </>
  );
}
