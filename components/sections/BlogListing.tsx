"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { CmsImage } from "@/components/shared/CmsImage";
import { Stagger, StaggerItem } from "@/components/shared/motion";
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
      <p className="mt-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        Blog posts will appear here once published.
      </p>
    );
  }

  return (
    <>
      {categories.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryPill
            label="All"
            active={!category}
            onClick={() => {
              setCategory(null);
              setPage(1);
            }}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={category === cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            />
          ))}
        </div>
      ) : null}

      <Stagger
        key={`${category ?? "all"}-${currentPage}`}
        className="mt-8 grid gap-6 sm:grid-cols-2"
      >
        {pagePosts.map((post) => (
          <StaggerItem key={post._id} className="h-full">
            <article className="group h-full">
              <Link
                href={`/blog/${post.slug}/`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {post.mainImage ? (
                  <div className="overflow-hidden">
                    <CmsImage
                      image={post.mainImage}
                      alt={post.title}
                      width={600}
                      height={340}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs">
                    {post.category ? (
                      <span className="rounded-full bg-brand-gold/15 px-2.5 py-1 font-semibold uppercase tracking-wide text-brand-gold">
                        {post.category}
                      </span>
                    ) : null}
                    {post.publishedAt ? (
                      <time className="text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-brand-navy transition-colors group-hover:text-brand-gold">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  ) : (
                    <span className="flex-1" />
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      {totalPages > 1 ? (
        <nav aria-label="Blog pagination" className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-brand-navy text-white"
                  : "border hover:border-brand-gold hover:text-brand-gold"
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

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-brand-gold bg-brand-gold/15 text-brand-navy"
          : "text-muted-foreground hover:border-brand-gold hover:text-brand-navy"
      }`}
    >
      {label}
    </button>
  );
}
