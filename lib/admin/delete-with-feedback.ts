"use client";

import { toast } from "sonner";

import { CMS_SAVE_MESSAGES, getErrorMessage } from "@/lib/admin/cms-save-feedback";

export async function deleteWithFeedback(
  deleteFn: () => Promise<void>,
  label: string,
): Promise<boolean> {
  if (!confirm(`Delete this ${label}? This cannot be undone.`)) {
    return false;
  }

  try {
    await deleteFn();
    toast.success(CMS_SAVE_MESSAGES.deleted(label));
    return true;
  } catch (error) {
    toast.error(CMS_SAVE_MESSAGES.deleteFailed(label), {
      description: getErrorMessage(error),
    });
    return false;
  }
}
