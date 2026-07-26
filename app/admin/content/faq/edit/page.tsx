"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import { stripFirestoreId } from "@/lib/admin/strip-firestore-id";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { FaqItem } from "@/types";

function FaqEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<FaqItem, "_id">>({ question: "", answer: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<FaqItem, "_id"> & { id: string }>(
      CMS_COLLECTIONS.faqItems,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback((key: keyof Omit<FaqItem, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.faqItems,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/faq/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Edit FAQ</h1>
      <FormField
        label="Question"
        value={form.question}
        onChange={(v) => update("question", v)}
      />
      <MarkdownField
        label="Answer"
        value={form.answer}
        onChange={(v) => update("answer", v)}
      />
      <FormField
        label="Order"
        type="number"
        value={String(form.order ?? "")}
        onChange={(v) => update("order", v ? Number(v) : undefined)}
      />
      <FormField
        label="Anchor ID"
        value={form.anchorId ?? ""}
        onChange={(v) => update("anchorId", v)}
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
            await deleteCollectionDoc(CMS_COLLECTIONS.faqItems, docId);
            router.push("/admin/content/faq/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function FaqEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <FaqEditForm />
    </Suspense>
  );
}
