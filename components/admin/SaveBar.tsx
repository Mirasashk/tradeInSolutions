"use client";

import { useState } from "react";
import { toast } from "sonner";

import { getIdToken } from "@/lib/firebase/auth";
import { CMS_SAVE_MESSAGES, getErrorMessage } from "@/lib/admin/cms-save-feedback";
import { Button } from "@/components/ui/button";

type SaveBarProps = {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  saving?: boolean;
};

export function SaveBar({ onSaveDraft, onPublish, saving }: SaveBarProps) {
  const [publishing, setPublishing] = useState(false);

  async function handleSaveDraft() {
    try {
      await onSaveDraft();
      toast.success(CMS_SAVE_MESSAGES.draftSaved);
    } catch (error) {
      toast.error(CMS_SAVE_MESSAGES.draftFailed, {
        description: getErrorMessage(error),
      });
    }
  }

  async function handlePublishContent() {
    try {
      await onPublish();
      toast.success(CMS_SAVE_MESSAGES.contentPublished);
    } catch (error) {
      toast.error(CMS_SAVE_MESSAGES.publishFailed, {
        description: getErrorMessage(error),
      });
    }
  }

  async function handlePublishSite() {
    setPublishing(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${window.location.origin}/api/cms-publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Publish failed (${res.status})`);
      }

      toast.success(CMS_SAVE_MESSAGES.siteRebuildTriggered);
    } catch (error) {
      toast.error(CMS_SAVE_MESSAGES.sitePublishFailed, {
        description: getErrorMessage(error),
      });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-8 mt-8 flex flex-wrap items-center gap-3 border-t bg-white px-8 py-4">
      <Button
        variant="outline"
        disabled={saving}
        onClick={() => void handleSaveDraft()}
      >
        {saving ? "Saving…" : "Save draft"}
      </Button>
      <Button disabled={saving} onClick={() => void handlePublishContent()}>
        {saving ? "Saving…" : "Publish content"}
      </Button>
      <Button
        variant="secondary"
        disabled={publishing}
        onClick={() => void handlePublishSite()}
      >
        {publishing ? "Triggering…" : "Publish site"}
      </Button>
    </div>
  );
}
