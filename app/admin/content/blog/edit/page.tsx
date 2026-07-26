"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import {
  CMS_COLLECTIONS,
  deleteCollectionDoc,
  getCollectionDoc,
  saveCollectionDoc,
} from "@/lib/firebase/firestore";
import type { BlogPost } from "@/types";

type BlogForm = Omit<BlogPost, "_id"> & { id?: string };

function BlogEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<BlogForm>({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<BlogForm>(CMS_COLLECTIONS.blogPosts, docId).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback(<K extends keyof BlogForm>(key: K, value: BlogForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.blogPosts,
        isNew ? null : docId,
        form,
        status,
      );
      if (isNew) router.replace(`/admin/content/blog/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew || !docId || !confirm("Delete this post?")) return;
    await deleteCollectionDoc(CMS_COLLECTIONS.blogPosts, docId);
    router.push("/admin/content/blog/");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">
          {isNew ? "New blog post" : "Edit blog post"}
        </h1>
        {!isNew ? (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        ) : null}
      </div>
      <FormField
        label="Title"
        value={form.title}
        onChange={(v) => update("title", v)}
      />
      <FormField label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
      <FormField
        label="Excerpt"
        value={form.excerpt ?? ""}
        onChange={(v) => update("excerpt", v)}
      />
      <FormField
        label="Author"
        value={form.author ?? ""}
        onChange={(v) => update("author", v)}
      />
      <FormField
        label="Category"
        value={form.category ?? ""}
        onChange={(v) => update("category", v)}
      />
      <FormField
        label="Published at (ISO date)"
        value={form.publishedAt ?? ""}
        onChange={(v) => update("publishedAt", v)}
      />
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
      <ImageUploadField
        label="Main image"
        value={form.mainImage}
        onChange={(v) => update("mainImage", v ?? undefined)}
        collection="blogPosts"
        docId={docId ?? "new"}
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
    </div>
  );
}

export default function BlogEditAdminPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <BlogEditForm />
    </Suspense>
  );
}
