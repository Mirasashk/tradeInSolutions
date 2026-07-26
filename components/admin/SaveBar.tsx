"use client";

import { useState } from "react";

import { getIdToken } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

type SaveBarProps = {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  saving?: boolean;
};

export function SaveBar({ onSaveDraft, onPublish, saving }: SaveBarProps) {
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePublishSite() {
    setPublishing(true);
    setMessage(null);
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

      setMessage("Site rebuild triggered. Production will update in a few minutes.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to publish site");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-8 mt-8 flex flex-wrap items-center gap-3 border-t bg-white px-8 py-4">
      <Button variant="outline" disabled={saving} onClick={() => onSaveDraft()}>
        {saving ? "Saving…" : "Save draft"}
      </Button>
      <Button disabled={saving} onClick={() => onPublish()}>
        {saving ? "Saving…" : "Publish content"}
      </Button>
      <Button variant="secondary" disabled={publishing} onClick={handlePublishSite}>
        {publishing ? "Triggering…" : "Publish site"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
