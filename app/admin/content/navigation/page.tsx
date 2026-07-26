"use client";

import { useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import {
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { NavItem } from "@/types";

const DOC_ID = CMS_SINGLETON_IDS.navigation;

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getSingletonDoc<{ items: NavItem[] }>(DOC_ID).then((data) => {
      if (data?.items) setItems(data.items);
      setLoading(false);
    });
  }, []);

  async function save(status: "draft" | "published") {
    setSaving(true);
    try {
      const validItems = items.filter((item) => item.label.trim() && item.href.trim());
      await saveSingletonDoc(DOC_ID, { items: validItems }, status);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Navigation</h1>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 rounded-md border p-4">
          <div className="flex-1 space-y-2">
            <FormField
              label="Label"
              value={item.label}
              onChange={(v) => {
                const next = [...items];
                next[index] = { ...next[index]!, label: v };
                setItems(next);
              }}
            />
            <FormField
              label="Href"
              value={item.href}
              onChange={(v) => {
                const next = [...items];
                next[index] = { ...next[index]!, href: v };
                setItems(next);
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => setItems(items.filter((_, i) => i !== index))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => setItems([...items, { label: "", href: "/" }])}
      >
        Add link
      </Button>
      <SaveBar
        saving={saving}
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
      />
    </div>
  );
}
