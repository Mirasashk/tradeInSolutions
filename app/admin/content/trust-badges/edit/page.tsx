"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import { CmsEditorLayout } from "@/components/admin/CmsEditorLayout";
import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { useCmsEditorMeta } from "@/lib/admin/use-cms-editor-meta";
import { stripFirestoreId } from "@/lib/admin/strip-firestore-id";
import { deleteWithFeedback } from "@/lib/admin/delete-with-feedback";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { TrustBadge } from "@/types";

function TrustBadgeEditForm() {
  const editorMeta = useCmsEditorMeta();
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<TrustBadge, "_id">>({ label: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<TrustBadge, "_id"> & { id: string }>(
      CMS_COLLECTIONS.trustBadges,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback((key: keyof Omit<TrustBadge, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.trustBadges,
        isNew ? null : docId,
        form,
        status,
        editorMeta,
      );
      if (isNew) router.replace(`/admin/content/trust-badges/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <CmsEditorLayout
      versionHistory={{
        collectionPath: CMS_COLLECTIONS.trustBadges,
        docId: isNew ? null : docId,
        currentData: form,
        disabled: isNew,
        saving,
        onRestored: (data) =>
          setForm(stripContentMeta(data) as Omit<TrustBadge, "_id">),
        save: async (data, status, meta) => {
          await saveCollectionDoc(
            CMS_COLLECTIONS.trustBadges,
            isNew ? null : docId,
            data,
            status,
            meta ?? editorMeta,
          );
        },
      }}
    >
      <h1 className="text-2xl font-semibold text-brand-navy">Edit trust badge</h1>
      <FormField
        label="Label"
        value={form.label}
        onChange={(v) => update("label", v)}
      />
      <FormField
        label="Link"
        value={form.link ?? ""}
        onChange={(v) => update("link", v)}
      />
      <FormField
        label="Order"
        type="number"
        value={String(form.order ?? "")}
        onChange={(v) => update("order", v ? Number(v) : undefined)}
      />
      <ImageUploadField
        label="Icon"
        value={form.icon}
        onChange={(v) => update("icon", v)}
        collection="trustBadges"
        docId={docId ?? "new"}
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
            const deleted = await deleteWithFeedback(
              () => deleteCollectionDoc(CMS_COLLECTIONS.trustBadges, docId),
              "trust badge",
            );
            if (deleted) router.push("/admin/content/trust-badges/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </CmsEditorLayout>
  );
}

export default function TrustBadgeEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <TrustBadgeEditForm />
    </Suspense>
  );
}
