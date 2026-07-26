"use client";

import { CMS_COLLECTIONS, listCollectionDocsByDate } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { BlogPostSummary } from "@/types";

export default function BlogListAdminPage() {
  return (
    <CollectionListPage<BlogPostSummary & { id: string }>
      title="Blog Posts"
      collection={CMS_COLLECTIONS.blogPosts}
      listFn={listCollectionDocsByDate}
      editPath="/admin/content/blog/"
      getLabel={(item) => item.title || item.slug || item.id}
    />
  );
}
