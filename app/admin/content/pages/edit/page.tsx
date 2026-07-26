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
import type { PageContent } from "@/types";

function PageEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<PageContent, "_id">>({
    title: "",
    slug: "",
    body: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<PageContent, "_id"> & { id: string }>(
      CMS_COLLECTIONS.pages,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback((key: keyof Omit<PageContent, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.pages,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/pages/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Edit page</h1>
      <FormField
        label="Title"
        value={form.title}
        onChange={(v) => update("title", v)}
      />
      <FormField label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
      <FormField
        label="SEO title"
        value={form.seoTitle ?? ""}
        onChange={(v) => update("seoTitle", v)}
      />
      <FormField
        label="SEO description"
        value={form.seoDescription ?? ""}
        onChange={(v) => update("seoDescription", v)}
      />
      <MarkdownField
        label="Body"
        value={form.body ?? ""}
        onChange={(v) => update("body", v)}
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
            await deleteCollectionDoc(CMS_COLLECTIONS.pages, docId);
            router.push("/admin/content/pages/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export default function PageEditAdminPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <PageEditForm />
    </Suspense>
  );
}
