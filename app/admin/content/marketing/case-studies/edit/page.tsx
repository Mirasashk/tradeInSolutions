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
import type { CaseStudy } from "@/types";

function CaseStudyEditForm() {
  const editorMeta = useCmsEditorMeta();
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<CaseStudy, "_id">>({ hasPermission: true });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<CaseStudy, "_id"> & { id: string }>(
      CMS_COLLECTIONS.caseStudies,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback((key: keyof Omit<CaseStudy, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.caseStudies,
        isNew ? null : docId,
        form,
        status,
        editorMeta,
      );
      if (isNew) router.replace(`/admin/content/marketing/case-studies/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <CmsEditorLayout
      versionHistory={{
        collectionPath: CMS_COLLECTIONS.caseStudies,
        docId: isNew ? null : docId,
        currentData: form,
        disabled: isNew,
        saving,
        onRestored: (data) => setForm(stripContentMeta(data) as Omit<CaseStudy, "_id">),
        save: async (data, status, meta) => {
          await saveCollectionDoc(
            CMS_COLLECTIONS.caseStudies,
            isNew ? null : docId,
            data,
            status,
            meta ?? editorMeta,
          );
        },
      }}
    >
      <h1 className="text-2xl font-semibold text-brand-navy">Edit case study</h1>
      <FormField
        label="Customer name"
        value={form.customerName ?? ""}
        onChange={(v) => update("customerName", v)}
      />
      <FormField
        label="Car model"
        value={form.carModel ?? ""}
        onChange={(v) => update("carModel", v)}
      />
      <FormField
        label="Dealer offer"
        type="number"
        value={String(form.dealerOffer ?? "")}
        onChange={(v) => update("dealerOffer", v ? Number(v) : undefined)}
      />
      <FormField
        label="Our offer"
        type="number"
        value={String(form.ourOffer ?? "")}
        onChange={(v) => update("ourOffer", v ? Number(v) : undefined)}
      />
      <FormField
        label="Order"
        type="number"
        value={String(form.order ?? "")}
        onChange={(v) => update("order", v ? Number(v) : undefined)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.hasPermission ?? false}
          onChange={(e) => update("hasPermission", e.target.checked)}
        />
        Has customer permission to display
      </label>
      <ImageUploadField
        label="Photo"
        value={form.photo}
        onChange={(v) => update("photo", v ?? undefined)}
        collection="caseStudies"
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
              () => deleteCollectionDoc(CMS_COLLECTIONS.caseStudies, docId),
              "case study",
            );
            if (deleted) router.push("/admin/content/marketing/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </CmsEditorLayout>
  );
}

export default function CaseStudyEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CaseStudyEditForm />
    </Suspense>
  );
}
