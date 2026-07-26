"use client";

import { CMS_COLLECTIONS, listCollectionDocs } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { PageContent } from "@/types";

export default function PagesListAdminPage() {
  return (
    <CollectionListPage<PageContent & { id: string }>
      title="Pages"
      collection={CMS_COLLECTIONS.pages}
      listFn={listCollectionDocs}
      editPath="/admin/content/pages/"
      getLabel={(item) => item.title || item.slug || item.id}
    />
  );
}
