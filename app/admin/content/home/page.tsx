"use client";

import { useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar } from "@/components/admin/SaveBar";
import { StringListField } from "@/components/admin/StringListField";
import {
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { HomePageContent } from "@/types";

const DOC_ID = CMS_SINGLETON_IDS.homePage;

export default function HomePageAdminPage() {
  const [form, setForm] = useState<HomePageContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSingletonDoc<HomePageContent>(DOC_ID).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    <K extends keyof HomePageContent>(key: K, value: HomePageContent[K]) => {
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
      <h1 className="text-2xl font-semibold text-brand-navy">Home Page</h1>
      <FormField
        label="Hero headline"
        value={form.heroHeadline ?? ""}
        onChange={(v) => update("heroHeadline", v)}
      />
      <FormField
        label="Hero subheadline"
        value={form.heroSubheadline ?? ""}
        onChange={(v) => update("heroSubheadline", v)}
      />
      <ImageUploadField
        label="Hero image"
        value={form.heroImage}
        onChange={(v) => update("heroImage", v ?? undefined)}
        collection="singletons"
        docId={DOC_ID}
      />
      <FormField
        label="Video URL"
        value={form.videoUrl ?? ""}
        onChange={(v) => update("videoUrl", v)}
      />
      <FormField
        label="Primary CTA label"
        value={form.heroPrimaryCtaLabel ?? ""}
        onChange={(v) => update("heroPrimaryCtaLabel", v)}
      />
      <FormField
        label="Primary CTA href"
        value={form.heroPrimaryCtaHref ?? ""}
        onChange={(v) => update("heroPrimaryCtaHref", v)}
      />
      <FormField
        label="Secondary CTA label"
        value={form.heroSecondaryCtaLabel ?? ""}
        onChange={(v) => update("heroSecondaryCtaLabel", v)}
      />
      <FormField
        label="Secondary CTA href"
        value={form.heroSecondaryCtaHref ?? ""}
        onChange={(v) => update("heroSecondaryCtaHref", v)}
      />
      <FormField
        label="Why sell headline"
        value={form.whySellHeadline ?? ""}
        onChange={(v) => update("whySellHeadline", v)}
      />
      <StringListField
        label="Why sell bullets"
        values={form.whySellBullets ?? []}
        onChange={(v) => update("whySellBullets", v)}
      />
      <FormField
        label="Compare headline"
        value={form.compareHeadline ?? ""}
        onChange={(v) => update("compareHeadline", v)}
      />
      <StringListField
        label="Compare bullets"
        values={form.compareBullets ?? []}
        onChange={(v) => update("compareBullets", v)}
      />
      <StringListField
        label="Social proof ticker items"
        values={form.socialProofItems ?? []}
        onChange={(v) => update("socialProofItems", v)}
      />
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
    </div>
  );
}
