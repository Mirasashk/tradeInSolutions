"use client";

import { useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { CmsEditorLayout } from "@/components/admin/CmsEditorLayout";
import { SaveBar } from "@/components/admin/SaveBar";
import { StringListField } from "@/components/admin/StringListField";
import { Button } from "@/components/ui/button";
import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { useCmsEditorMeta } from "@/lib/admin/use-cms-editor-meta";
import {
  CMS_COLLECTIONS,
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { AppointmentPageContent, WhyUsCard } from "@/types";

const DOC_ID = CMS_SINGLETON_IDS.appointmentPage;

export default function AppointmentAdminPage() {
  const editorMeta = useCmsEditorMeta();
  const [form, setForm] = useState<AppointmentPageContent>({ whyUsCards: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSingletonDoc<AppointmentPageContent>(DOC_ID).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    <K extends keyof AppointmentPageContent>(
      key: K,
      value: AppointmentPageContent[K],
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  function updateCard(index: number, patch: Partial<WhyUsCard>) {
    const cards = [...(form.whyUsCards ?? [])];
    cards[index] = { ...cards[index], ...patch };
    update("whyUsCards", cards);
  }

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
        onRestored: (data) => setForm(stripContentMeta(data) as AppointmentPageContent),
        save: async (data, status, meta) => {
          await saveSingletonDoc(DOC_ID, data, status, meta ?? editorMeta);
        },
      }}
    >
      <h1 className="text-2xl font-semibold text-brand-navy">Appointment Page</h1>
      <FormField
        label="Hero title"
        value={form.heroTitle ?? ""}
        onChange={(v) => update("heroTitle", v)}
      />
      <FormField
        label="Hero subtitle"
        value={form.heroSubtitle ?? ""}
        onChange={(v) => update("heroSubtitle", v)}
      />
      <div className="space-y-4">
        <h2 className="font-medium">Why us cards</h2>
        {(form.whyUsCards ?? []).map((card, index) => (
          <div key={index} className="space-y-2 rounded-md border p-4">
            <FormField
              label="Title"
              value={card.title ?? ""}
              onChange={(v) => updateCard(index, { title: v })}
            />
            <FormField
              label="Description"
              value={card.description ?? ""}
              onChange={(v) => updateCard(index, { description: v })}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                update(
                  "whyUsCards",
                  (form.whyUsCards ?? []).filter((_, i) => i !== index),
                )
              }
            >
              Remove card
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => update("whyUsCards", [...(form.whyUsCards ?? []), {}])}
        >
          Add card
        </Button>
      </div>
      <StringListField
        label="Checklist — owned"
        values={form.checklistOwned ?? []}
        onChange={(v) => update("checklistOwned", v)}
      />
      <StringListField
        label="Checklist — financed"
        values={form.checklistFinanced ?? []}
        onChange={(v) => update("checklistFinanced", v)}
      />
      <StringListField
        label="Checklist — leased"
        values={form.checklistLeased ?? []}
        onChange={(v) => update("checklistLeased", v)}
      />
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
    </CmsEditorLayout>
  );
}
