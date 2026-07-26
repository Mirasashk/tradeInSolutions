import { stripContentMeta } from "@/lib/admin/cms-content-meta";
import { getCmsVersion } from "@/lib/firebase/cms-versions";
import type { CmsStatus, CmsWriteMeta } from "@/types/cms";

type RestoreCmsVersionArgs = {
  collectionPath: string;
  docId: string;
  versionId: string;
  meta?: CmsWriteMeta;
  save: (
    data: Record<string, unknown>,
    status: CmsStatus,
    meta?: CmsWriteMeta,
  ) => Promise<void>;
};

export async function restoreCmsVersion({
  collectionPath,
  docId,
  versionId,
  meta,
  save,
}: RestoreCmsVersionArgs): Promise<Record<string, unknown>> {
  const version = await getCmsVersion(collectionPath, docId, versionId);
  if (!version) {
    throw new Error("Version not found.");
  }

  const content = stripContentMeta(version.snapshot);
  if (!meta?.uid) {
    throw new Error("Editor metadata is required to restore a version.");
  }

  await save(content, "draft", {
    uid: meta.uid,
    email: meta.email,
    restoredFromVersionId: versionId,
  });

  return content;
}
