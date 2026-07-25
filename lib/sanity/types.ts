import type { PortableTextBlock } from "@portabletext/types";

export type SanityDocument = {
  _id: string;
  _type: string;
};

export type SanityPage = SanityDocument & {
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: PortableTextBlock[];
};

export type SanityBlogPost = SanityDocument & {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: PortableTextBlock[];
};
