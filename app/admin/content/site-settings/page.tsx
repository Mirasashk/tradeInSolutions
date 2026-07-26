"use client";

import { useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { CmsEditorLayout } from "@/components/admin/CmsEditorLayout";
import { SaveBar } from "@/components/admin/SaveBar";
import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { useCmsEditorMeta } from "@/lib/admin/use-cms-editor-meta";
import {
  CMS_COLLECTIONS,
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { SiteSettings } from "@/types";

const DOC_ID = CMS_SINGLETON_IDS.siteSettings;

export default function SiteSettingsAdminPage() {
  const editorMeta = useCmsEditorMeta();
  const [form, setForm] = useState<SiteSettings>({
    phone: "",
    email: "",
    address: "",
    hours: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSingletonDoc<SiteSettings>(DOC_ID).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      await saveSingletonDoc(DOC_ID, form, status, editorMeta);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <CmsEditorLayout
      versionHistory={{
        collectionPath: CMS_COLLECTIONS.singletons,
        docId: DOC_ID,
        currentData: form,
        saving,
        onRestored: (data) => setForm(stripContentMeta(data) as SiteSettings),
        save: async (data, status, meta) => {
          await saveSingletonDoc(DOC_ID, data, status, meta ?? editorMeta);
        },
      }}
    >
      <h1 className="text-2xl font-semibold text-brand-navy">Site Settings</h1>
      <FormField
        label="Phone"
        value={form.phone}
        onChange={(v) => update("phone", v)}
      />
      <FormField
        label="Email"
        value={form.email}
        onChange={(v) => update("email", v)}
      />
      <FormField
        label="Address"
        value={form.address}
        onChange={(v) => update("address", v)}
      />
      <FormField
        label="Hours"
        value={form.hours}
        onChange={(v) => update("hours", v)}
      />
      <FormField
        label="Tagline"
        value={form.tagline ?? ""}
        onChange={(v) => update("tagline", v)}
      />
      <FormField
        label="Announcement bar"
        value={form.announcementText ?? ""}
        onChange={(v) => update("announcementText", v)}
      />
      <FormField
        label="CTA banner text"
        value={form.ctaBannerText ?? ""}
        onChange={(v) => update("ctaBannerText", v)}
      />
      <FormField
        label="Yelp URL"
        value={form.yelpUrl ?? ""}
        onChange={(v) => update("yelpUrl", v)}
      />
      <FormField
        label="Yelp rating"
        type="number"
        value={String(form.yelpRating ?? "")}
        onChange={(v) => update("yelpRating", v ? Number(v) : undefined)}
      />
      <FormField
        label="Google URL"
        value={form.googleUrl ?? ""}
        onChange={(v) => update("googleUrl", v)}
      />
      <FormField
        label="Facebook URL"
        value={form.facebookUrl ?? ""}
        onChange={(v) => update("facebookUrl", v)}
      />
      <FormField
        label="Calendly URL"
        value={form.calendlyUrl ?? ""}
        onChange={(v) => update("calendlyUrl", v)}
      />
      <FormField
        label="Live chat script URL"
        value={form.liveChatScriptUrl ?? ""}
        onChange={(v) => update("liveChatScriptUrl", v)}
      />
      <FormField
        label="Exit intent title"
        value={form.exitIntentTitle ?? ""}
        onChange={(v) => update("exitIntentTitle", v)}
      />
      <FormField
        label="Exit intent message"
        value={form.exitIntentMessage ?? ""}
        onChange={(v) => update("exitIntentMessage", v)}
      />
      <ImageUploadField
        label="Logo"
        value={form.logo}
        onChange={(v) => update("logo", v ?? undefined)}
        collection="singletons"
        docId={DOC_ID}
      />
      <ImageUploadField
        label="Default OG image"
        value={form.defaultOgImage}
        onChange={(v) => update("defaultOgImage", v ?? undefined)}
        collection="singletons"
        docId={DOC_ID}
      />
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
    </CmsEditorLayout>
  );
}
