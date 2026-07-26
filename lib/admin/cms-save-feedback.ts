export const CMS_SAVE_MESSAGES = {
  draftSaved: "Draft saved",
  contentPublished: "Content published",
  siteRebuildTriggered: "Site rebuild triggered — production updates in a few minutes",
  versionRestored: "Version restored as draft",
  draftFailed: "Failed to save draft",
  publishFailed: "Failed to publish content",
  sitePublishFailed: "Failed to publish site",
  versionRestoreFailed: "Failed to restore version",
  deleted: (label: string) => `${label} deleted`,
  deleteFailed: (label: string) => `Failed to delete ${label}`,
  uploadFailed: "Image upload failed",
} as const;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
