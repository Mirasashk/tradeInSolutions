"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import { stripFirestoreId } from "@/lib/admin/strip-firestore-id";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { SocialProofItem } from "@/types";

function SocialProofEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<SocialProofItem, "_id">>({ text: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<SocialProofItem, "_id"> & { id: string }>(
      CMS_COLLECTIONS.socialProofItems,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback(
    (key: keyof Omit<SocialProofItem, "_id">, value: unknown) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.socialProofItems,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/marketing/social-proof/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Edit social proof item</h1>
      <FormField label="Text" value={form.text} onChange={(v) => update("text", v)} />
      <FormField
        label="Order"
        type="number"
        value={String(form.order ?? "")}
        onChange={(v) => update("order", v ? Number(v) : undefined)}
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
            await deleteCollectionDoc(CMS_COLLECTIONS.socialProofItems, docId);
            router.push("/admin/content/marketing/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function SocialProofEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <SocialProofEditForm />
    </Suspense>
  );
}
