"use client";

import { useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SaveBar } from "@/components/admin/SaveBar";
import {
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { AboutPageContent } from "@/types";

const DOC_ID = CMS_SINGLETON_IDS.aboutPage;

export default function AboutAdminPage() {
  const [form, setForm] = useState<AboutPageContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSingletonDoc<AboutPageContent>(DOC_ID).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    <K extends keyof AboutPageContent>(key: K, value: AboutPageContent[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      await saveSingletonDoc(DOC_ID, form, status);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">About Page</h1>
      <p className="text-sm text-muted-foreground">
        Manage team members and trust badges from the Marketing section or Team / Trust
        Badges in the sidebar.
      </p>
      <FormField
        label="Hero title"
        value={form.heroTitle ?? ""}
        onChange={(v) => update("heroTitle", v)}
      />
      <MarkdownField
        label="Story"
        value={form.story ?? ""}
        onChange={(v) => update("story", v)}
      />
      <MarkdownField
        label="Confidence guarantee"
        value={form.confidenceGuarantee ?? ""}
        onChange={(v) => update("confidenceGuarantee", v)}
      />
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
    </div>
  );
}
