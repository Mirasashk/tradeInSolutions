"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";
import type { LeadMagnet } from "@/types";

export function LeadMagnetCard({ leadMagnet }: { leadMagnet: LeadMagnet | null }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!leadMagnet?.title) return null;

  const downloadUrl = leadMagnet.downloadUrl;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    trackFormSubmit("lead_magnet");
    setSubmitted(true);
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }

  return (
    <aside className="rounded-lg border bg-muted/40 p-6">
      <h3 className="text-lg font-semibold text-brand-navy">{leadMagnet.title}</h3>
      {leadMagnet.description ? (
        <p className="mt-2 text-sm text-muted-foreground">{leadMagnet.description}</p>
      ) : null}
      {submitted ? (
        <p className="mt-4 text-sm text-green-700">Thanks! Check your download.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => trackFormStart("lead_magnet")}
          />
          <Button type="submit">Download</Button>
        </form>
      )}
    </aside>
  );
}
