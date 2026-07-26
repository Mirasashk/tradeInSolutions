"use client";

import { CMS_COLLECTIONS, listCollectionDocs } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { FaqItem } from "@/types";

export default function FaqListPage() {
  return (
    <CollectionListPage<FaqItem & { id: string }>
      title="FAQ"
      collection={CMS_COLLECTIONS.faqItems}
      listFn={listCollectionDocs}
      editPath="/admin/content/faq/"
      getLabel={(item) => item.question || item.id}
    />
  );
}
