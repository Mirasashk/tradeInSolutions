"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { Testimonial } from "@/types";

function TestimonialEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<Testimonial, "_id">>({
    name: "",
    quote: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<Testimonial, "_id"> & { id: string }>(
      CMS_COLLECTIONS.testimonials,
      docId,
    ).then((data) => {
      if (data) {
        const rest = { ...data };
        delete rest.id;
        setForm(rest);
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback(
    (key: keyof Omit<Testimonial, "_id">, value: string | number | undefined) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.testimonials,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/testimonials/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Edit testimonial</h1>
      <FormField label="Name" value={form.name} onChange={(v) => update("name", v)} />
      <FormField
        label="Location"
        value={form.location ?? ""}
        onChange={(v) => update("location", v)}
      />
      <FormField
        label="Car model"
        value={form.carModel ?? ""}
        onChange={(v) => update("carModel", v)}
      />
      <FormField
        label="Quote"
        value={form.quote}
        onChange={(v) => update("quote", v)}
      />
      <FormField
        label="Rating"
        type="number"
        value={String(form.rating ?? "")}
        onChange={(v) => update("rating", v ? Number(v) : undefined)}
      />
      <FormField
        label="Published at"
        value={form.publishedAt ?? ""}
        onChange={(v) => update("publishedAt", v)}
      />
      <FormField
        label="Video URL"
        value={form.videoUrl ?? ""}
        onChange={(v) => update("videoUrl", v)}
      />
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
      {!isNew && docId ? (
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteCollectionDoc(CMS_COLLECTIONS.testimonials, docId);
            router.push("/admin/content/testimonials/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function TestimonialEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <TestimonialEditForm />
    </Suspense>
  );
}
