"use client";

import { useMemo } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import type { CmsWriteMeta } from "@/types/cms";

export function useCmsEditorMeta(): CmsWriteMeta | undefined {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user?.uid) return undefined;
    return {
      uid: user.uid,
      email: user.email ?? undefined,
    };
  }, [user]);
}
