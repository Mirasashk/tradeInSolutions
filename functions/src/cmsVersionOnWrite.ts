import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";
import type { Change } from "firebase-functions/v1";
import type { DocumentSnapshot } from "firebase-functions/v1/firestore";

import { getDb } from "./lib/admin";

const MAX_VERSIONS_PER_DOC = 50;
const CMS_VERSIONS_SUBCOLLECTION = "versions";

type CmsVersionAction = "draft" | "published" | "revert";

function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => {
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return Object.keys(nested as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = (nested as Record<string, unknown>)[key];
          return acc;
        }, {});
    }
    return nested;
  });
}

function inferAction(
  before: FirebaseFirestore.DocumentData,
  after: FirebaseFirestore.DocumentData,
): CmsVersionAction {
  if (typeof after.restoredFromVersionId === "string" && after.restoredFromVersionId) {
    return "revert";
  }
  if (before.status !== "published" && after.status === "published") {
    return "published";
  }
  if (after.status === "published") {
    return "published";
  }
  return "draft";
}

async function archivePreviousVersion(
  collectionName: string,
  docId: string,
  before: FirebaseFirestore.DocumentData,
  after: FirebaseFirestore.DocumentData,
) {
  const db = getDb();
  const versionsRef = db
    .collection(collectionName)
    .doc(docId)
    .collection(CMS_VERSIONS_SUBCOLLECTION);

  const restoredFromVersionId =
    typeof after.restoredFromVersionId === "string"
      ? after.restoredFromVersionId
      : undefined;

  await versionsRef.add({
    createdAt: FieldValue.serverTimestamp(),
    createdBy: after.updatedBy ?? null,
    action: inferAction(before, after),
    status: before.status ?? "draft",
    snapshot: before,
    ...(restoredFromVersionId ? { restoredFromVersionId } : {}),
  });

  const versionsSnap = await versionsRef.orderBy("createdAt", "desc").get();
  if (versionsSnap.size <= MAX_VERSIONS_PER_DOC) return;

  const batch = db.batch();
  versionsSnap.docs.slice(MAX_VERSIONS_PER_DOC).forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();
}

async function handleCmsVersionWrite(
  change: Change<DocumentSnapshot>,
  collectionName: string,
  docId: string,
) {
  const beforeSnap = change.before;
  const afterSnap = change.after;

  if (!beforeSnap.exists || !afterSnap.exists) return;

  const before = beforeSnap.data();
  const after = afterSnap.data();
  if (!before || !after) return;

  if (stableStringify(before) === stableStringify(after)) return;

  await archivePreviousVersion(collectionName, docId, before, after);
}

function createCmsVersionTrigger(collectionName: string) {
  return functions
    .region("us-west1")
    .firestore.document(`${collectionName}/{docId}`)
    .onWrite(async (change, context) => {
      await handleCmsVersionWrite(change, collectionName, context.params.docId);
    });
}

export const cmsVersionOnWriteSingletons = createCmsVersionTrigger("cmsSingletons");
export const cmsVersionOnWritePages = createCmsVersionTrigger("cmsPages");
export const cmsVersionOnWriteBlogPosts = createCmsVersionTrigger("cmsBlogPosts");
export const cmsVersionOnWriteTestimonials = createCmsVersionTrigger("cmsTestimonials");
export const cmsVersionOnWriteLocations = createCmsVersionTrigger("cmsLocations");
export const cmsVersionOnWriteFaqItems = createCmsVersionTrigger("cmsFaqItems");
export const cmsVersionOnWriteTeamMembers = createCmsVersionTrigger("cmsTeamMembers");
export const cmsVersionOnWriteTrustBadges = createCmsVersionTrigger("cmsTrustBadges");
export const cmsVersionOnWriteCaseStudies = createCmsVersionTrigger("cmsCaseStudies");
export const cmsVersionOnWriteSocialProofItems =
  createCmsVersionTrigger("cmsSocialProofItems");
