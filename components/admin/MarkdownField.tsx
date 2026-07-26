"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

type MarkdownFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  preview?: boolean;
};

export function MarkdownField({
  label,
  value,
  onChange,
  rows = 8,
  preview = true,
}: MarkdownFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {preview && value ? (
        <div className="rounded-md border bg-white p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
          <MarkdownContent value={value} />
        </div>
      ) : null}
    </div>
  );
}
