"use client";

import { CMS_COLLECTIONS, listCollectionDocs } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { Location } from "@/types";

export default function LocationsListPage() {
  return (
    <CollectionListPage<Location & { id: string }>
      title="Locations"
      collection={CMS_COLLECTIONS.locations}
      listFn={listCollectionDocs}
      editPath="/admin/content/locations/"
      getLabel={(item) => item.name || item.id}
    />
  );
}
