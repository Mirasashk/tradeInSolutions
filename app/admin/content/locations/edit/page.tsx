"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SaveBar } from "@/components/admin/SaveBar";
import { StringListField } from "@/components/admin/StringListField";
import { Button } from "@/components/ui/button";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { Location } from "@/types";

function LocationEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<Location, "_id">>({ name: "", address: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<Location, "_id"> & { id: string }>(
      CMS_COLLECTIONS.locations,
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

  const update = useCallback((key: keyof Omit<Location, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.locations,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/locations/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Edit location</h1>
      <FormField label="Name" value={form.name} onChange={(v) => update("name", v)} />
      <FormField
        label="Address"
        value={form.address}
        onChange={(v) => update("address", v)}
      />
      <FormField
        label="Phone"
        value={form.phone ?? ""}
        onChange={(v) => update("phone", v)}
      />
      <StringListField
        label="Additional phones"
        values={form.phones ?? []}
        onChange={(v) => update("phones", v)}
      />
      <FormField
        label="Hours"
        value={form.hours ?? ""}
        onChange={(v) => update("hours", v)}
      />
      <FormField
        label="Location type"
        value={form.locationType ?? ""}
        onChange={(v) => update("locationType", v)}
      />
      <FormField
        label="Note"
        value={form.note ?? ""}
        onChange={(v) => update("note", v)}
      />
      <FormField
        label="Map embed URL"
        value={form.mapEmbedUrl ?? ""}
        onChange={(v) => update("mapEmbedUrl", v)}
      />
      <ImageUploadField
        label="Photo"
        value={form.photo}
        onChange={(v) => update("photo", v ?? undefined)}
        collection="locations"
        docId={docId ?? "new"}
      />
      <MarkdownField
        label="Directions"
        value={form.directions ?? ""}
        onChange={(v) => update("directions", v)}
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
            await deleteCollectionDoc(CMS_COLLECTIONS.locations, docId);
            router.push("/admin/content/locations/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function LocationEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <LocationEditForm />
    </Suspense>
  );
}
