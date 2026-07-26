"use client";

import { useRef, useState } from "react";

import { uploadCmsImage } from "@/lib/firebase/storage";
import type { CmsImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CmsImage as CmsImageComponent } from "@/components/shared/CmsImage";

type ImageUploadFieldProps = {
  label: string;
  value?: CmsImage | null;
  onChange: (image: CmsImage | null) => void;
  collection: string;
  docId: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  collection,
  docId,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const image = await uploadCmsImage(file, collection, docId, value?.alt);
      onChange(image);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value?.url ? (
        <div className="flex items-start gap-4">
          <CmsImageComponent
            image={value}
            alt={value.alt ?? label}
            width={120}
            height={80}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        </div>
      ) : null}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <Input
        placeholder="Alt text"
        value={value?.alt ?? ""}
        onChange={(e) => onChange(value ? { ...value, alt: e.target.value } : null)}
      />
      {uploading ? <p className="text-xs text-muted-foreground">Uploading…</p> : null}
    </div>
  );
}
