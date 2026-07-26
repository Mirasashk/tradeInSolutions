"use client";

import { CMS_COLLECTIONS, listCollectionDocs } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { TrustBadge } from "@/types";

export default function TrustBadgesListPage() {
  return (
    <CollectionListPage<TrustBadge & { id: string }>
      title="Trust Badges"
      collection={CMS_COLLECTIONS.trustBadges}
      listFn={listCollectionDocs}
      editPath="/admin/content/trust-badges/"
      getLabel={(item) => item.label || item.id}
    />
  );
}
