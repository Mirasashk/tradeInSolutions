"use client";

import { CMS_COLLECTIONS, listCollectionDocs } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { TeamMember } from "@/types";

export default function TeamListPage() {
  return (
    <CollectionListPage<TeamMember & { id: string }>
      title="Team Members"
      collection={CMS_COLLECTIONS.teamMembers}
      listFn={listCollectionDocs}
      editPath="/admin/content/team/"
      getLabel={(item) => item.name || item.id}
    />
  );
}
