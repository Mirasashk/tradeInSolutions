"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { FormField } from "@/components/admin/FormField";
import { CmsEditorLayout } from "@/components/admin/CmsEditorLayout";
import { SaveBar } from "@/components/admin/SaveBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { useCmsEditorMeta } from "@/lib/admin/use-cms-editor-meta";
import {
  CMS_COLLECTIONS,
  CMS_SINGLETON_IDS,
  getSingletonDoc,
  listCollectionDocs,
  saveSingletonDoc,
} from "@/lib/firebase/firestore";
import type { CaseStudy, LeadMagnet, SocialProofItem } from "@/types";

export default function MarketingAdminPage() {
  const editorMeta = useCmsEditorMeta();
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnet>({});
  const [caseStudies, setCaseStudies] = useState<(CaseStudy & { id: string })[]>([]);
  const [socialProof, setSocialProof] = useState<(SocialProofItem & { id: string })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      getSingletonDoc<LeadMagnet>(CMS_SINGLETON_IDS.leadMagnet),
      listCollectionDocs<CaseStudy & { id: string }>(CMS_COLLECTIONS.caseStudies),
      listCollectionDocs<SocialProofItem & { id: string }>(
        CMS_COLLECTIONS.socialProofItems,
      ),
    ]).then(([lm, cs, sp]) => {
      if (lm) setLeadMagnet(lm);
      setCaseStudies(cs);
      setSocialProof(sp);
      setLoading(false);
    });
  }, []);

  const updateLm = useCallback(
    <K extends keyof LeadMagnet>(key: K, value: LeadMagnet[K]) => {
      setLeadMagnet((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function saveLeadMagnet(status: "draft" | "published") {
    setSaving(true);
    try {
      await saveSingletonDoc(
        CMS_SINGLETON_IDS.leadMagnet,
        leadMagnet,
        status,
        editorMeta,
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-brand-navy">Marketing</h1>

      <CmsEditorLayout
        versionHistory={{
          collectionPath: CMS_COLLECTIONS.singletons,
          docId: CMS_SINGLETON_IDS.leadMagnet,
          currentData: leadMagnet,
          saving,
          onRestored: (data) => setLeadMagnet(stripContentMeta(data) as LeadMagnet),
          save: async (data, status, meta) => {
            await saveSingletonDoc(
              CMS_SINGLETON_IDS.leadMagnet,
              data,
              status,
              meta ?? editorMeta,
            );
          },
        }}
      >
        <h2 className="text-lg font-medium">Lead magnet</h2>
        <FormField
          label="Title"
          value={leadMagnet.title ?? ""}
          onChange={(v) => updateLm("title", v)}
        />
        <FormField
          label="Description"
          value={leadMagnet.description ?? ""}
          onChange={(v) => updateLm("description", v)}
        />
        <FormField
          label="Download URL"
          value={leadMagnet.downloadUrl ?? ""}
          onChange={(v) => updateLm("downloadUrl", v)}
        />
        <SaveBar
          saving={saving}
          onSaveDraft={() => saveLeadMagnet("draft")}
          onPublish={() => saveLeadMagnet("published")}
        />
      </CmsEditorLayout>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Case studies</h2>
          <Button asChild size="sm">
            <Link href="/admin/content/marketing/case-studies/edit/?id=new">Add</Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {caseStudies.map((item) => (
            <Link
              key={item.id}
              href={`/admin/content/marketing/case-studies/edit/?id=${item.id}`}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {item.customerName ?? item.carModel ?? item.id}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Social proof ticker</h2>
          <Button asChild size="sm">
            <Link href="/admin/content/marketing/social-proof/edit/?id=new">Add</Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {socialProof.map((item) => (
            <Link
              key={item.id}
              href={`/admin/content/marketing/social-proof/edit/?id=${item.id}`}
            >
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">{item.text}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Team members</h2>
          <Button asChild size="sm">
            <Link href="/admin/content/team/edit/?id=new">Add</Link>
          </Button>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/content/team/">Manage team</Link>
        </Button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Trust badges</h2>
          <Button asChild size="sm">
            <Link href="/admin/content/trust-badges/edit/?id=new">Add</Link>
          </Button>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/content/trust-badges/">Manage badges</Link>
        </Button>
      </section>
    </div>
  );
}
