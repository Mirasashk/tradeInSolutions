"use client";

import { CMS_COLLECTIONS, listCollectionDocsByDate } from "@/lib/firebase/firestore";
import { CollectionListPage } from "@/components/admin/CollectionListPage";
import type { Testimonial } from "@/types";

export default function TestimonialsListPage() {
  return (
    <CollectionListPage<Testimonial & { id: string }>
      title="Testimonials"
      collection={CMS_COLLECTIONS.testimonials}
      listFn={listCollectionDocsByDate}
      editPath="/admin/content/testimonials/"
      getLabel={(item) => item.name || item.id}
    />
  );
}
