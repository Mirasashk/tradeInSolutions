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
import type { TeamMember } from "@/types";

function TeamEditForm() {
  const editorMeta = useCmsEditorMeta();
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const isNew = !docId || docId === "new";
  const [form, setForm] = useState<Omit<TeamMember, "_id">>({ name: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !docId) return;
    void getCollectionDoc<Omit<TeamMember, "_id"> & { id: string }>(
      CMS_COLLECTIONS.teamMembers,
      docId,
    ).then((data) => {
      if (data) {
        setForm(stripFirestoreId(data));
      }
      setLoading(false);
    });
  }, [isNew, docId]);

  const update = useCallback((key: keyof Omit<TeamMember, "_id">, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const id = await saveCollectionDoc(
        CMS_COLLECTIONS.teamMembers,
        isNew ? null : docId,
        form,
        status,
        editorMeta,
      );
      if (isNew) router.replace(`/admin/content/team/edit/?id=${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <CmsEditorLayout
      versionHistory={{
        collectionPath: CMS_COLLECTIONS.teamMembers,
        docId: isNew ? null : docId,
        currentData: form,
        disabled: isNew,
        saving,
        onRestored: (data) =>
          setForm(stripContentMeta(data) as Omit<TeamMember, "_id">),
        save: async (data, status, meta) => {
          await saveCollectionDoc(
            CMS_COLLECTIONS.teamMembers,
            isNew ? null : docId,
            data,
            status,
            meta ?? editorMeta,
          );
        },
      }}
    >
      <h1 className="text-2xl font-semibold text-brand-navy">Edit team member</h1>
      <FormField label="Name" value={form.name} onChange={(v) => update("name", v)} />
      <FormField
        label="Role"
        value={form.role ?? ""}
        onChange={(v) => update("role", v)}
      />
      <FormField
        label="Bio"
        value={form.bio ?? ""}
        onChange={(v) => update("bio", v)}
      />
      <FormField
        label="Order"
        type="number"
        value={String(form.order ?? "")}
        onChange={(v) => update("order", v ? Number(v) : undefined)}
      />
      <ImageUploadField
        label="Photo"
        value={form.photo}
        onChange={(v) => update("photo", v ?? undefined)}
        collection="teamMembers"
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
              () => deleteCollectionDoc(CMS_COLLECTIONS.teamMembers, docId),
              "team member",
            );
            if (deleted) router.push("/admin/content/team/");
          }}
        >
          Delete
        </Button>
      ) : null}
    </CmsEditorLayout>
  );
}

export default function TeamEditPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <TeamEditForm />
    </Suspense>
  );
}
