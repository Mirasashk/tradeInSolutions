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
import type { TrustBadge } from "@/types";

function TrustBadgeEditForm() {
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
        const rest = { ...data };
        delete rest.id;
        setForm(rest);
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
      );
      if (isNew) router.replace(`/admin/content/trust-badges/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
        onChange={(v) => update("icon", v ?? undefined)}
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
            await deleteCollectionDoc(CMS_COLLECTIONS.trustBadges, docId);
            router.push("/admin/content/trust-badges/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function TrustBadgeEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <TrustBadgeEditForm />
    </Suspense>
  );
}
