import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { getClientDb } from "@/lib/firebase/firestore";
import { CMS_VERSIONS_SUBCOLLECTION, type CmsVersion } from "@/types/cms";

function timestampToIso(value: unknown): string | undefined {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return undefined;
}

function mapVersion(id: string, data: Record<string, unknown>): CmsVersion {
  return {
    id,
    createdAt: timestampToIso(data.createdAt),
    createdBy: data.createdBy as CmsVersion["createdBy"],
    action: data.action as CmsVersion["action"],
    status: data.status as CmsVersion["status"],
    snapshot: (data.snapshot as Record<string, unknown>) ?? {},
    restoredFromVersionId:
      typeof data.restoredFromVersionId === "string"
        ? data.restoredFromVersionId
        : undefined,
  };
}

export async function listCmsVersions(
  collectionPath: string,
  docId: string,
  max = 50,
): Promise<CmsVersion[]> {
  const db = getClientDb();
  const versionsRef = collection(db, collectionPath, docId, CMS_VERSIONS_SUBCOLLECTION);
  const snap = await getDocs(
    query(versionsRef, orderBy("createdAt", "desc"), limit(max)),
  );

  return snap.docs.map((versionDoc) =>
    mapVersion(versionDoc.id, versionDoc.data() as Record<string, unknown>),
  );
}

export async function getCmsVersion(
  collectionPath: string,
  docId: string,
  versionId: string,
): Promise<CmsVersion | null> {
  const db = getClientDb();
  const versionRef = doc(
    db,
    collectionPath,
    docId,
    CMS_VERSIONS_SUBCOLLECTION,
    versionId,
  );
  const snap = await getDoc(versionRef);
  if (!snap.exists()) return null;
  return mapVersion(snap.id, snap.data() as Record<string, unknown>);
}
