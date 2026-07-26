"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { CaseStudy } from "@/types";

function CaseStudyEditForm() {
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
        const rest = { ...data };
        delete rest.id;
        setForm(rest);
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
      );
      if (isNew) router.replace(`/admin/content/marketing/case-studies/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
            await deleteCollectionDoc(CMS_COLLECTIONS.caseStudies, docId);
            router.push("/admin/content/marketing/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function CaseStudyEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CaseStudyEditForm />
    </Suspense>
  );
}
