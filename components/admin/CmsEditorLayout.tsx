"use client";

import type { ReactNode } from "react";

import {
  CmsVersionHistory,
  type CmsVersionHistoryProps,
} from "@/components/admin/versions/CmsVersionHistory";
import type { CmsStatus, CmsWriteMeta } from "@/types/cms";

type CmsEditorLayoutProps<T extends Record<string, unknown>> = {
  children: ReactNode;
  versionHistory: CmsVersionHistoryProps<T>;
  className?: string;
};

export function CmsEditorLayout<T extends Record<string, unknown>>({
  children,
  versionHistory,
  className,
}: CmsEditorLayoutProps<T>) {
  return (
    <div
      className={`mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start ${className ?? ""}`}
    >
      <div className="min-w-0 flex-1 space-y-6">{children}</div>
      <CmsVersionHistory {...versionHistory} />
    </div>
  );
}

export type { CmsStatus, CmsWriteMeta };
