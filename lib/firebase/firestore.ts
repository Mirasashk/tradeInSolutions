import { getFirebaseApp } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  orderBy,
  where,
  serverTimestamp,
  type DocumentData,
  getFirestore,
} from "firebase/firestore";

import {
  CMS_COLLECTIONS,
  CMS_SINGLETON_IDS,
  type CmsStatus,
  type CmsWriteMeta,
} from "@/types/cms";
import type { AdminUser } from "@/types";

import { sanitizeForFirestore } from "./sanitize-firestore-data";

export function getClientDb() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured.");
  }
  return getFirestore(app);
}

export async function isAdminUser(uid: string): Promise<boolean> {
  const db = getClientDb();
  const snap = await getDoc(doc(db, CMS_COLLECTIONS.admins, uid));
  return snap.exists();
}

export async function getAdminProfile(uid: string): Promise<AdminUser | null> {
  const db = getClientDb();
  const snap = await getDoc(doc(db, CMS_COLLECTIONS.admins, uid));
  if (!snap.exists()) return null;
  return snap.data() as AdminUser;
}

export async function getSingletonDoc<T>(
  docId: string,
): Promise<(T & { status?: CmsStatus }) | null> {
  const db = getClientDb();
  const snap = await getDoc(doc(db, CMS_COLLECTIONS.singletons, docId));
  if (!snap.exists()) return null;
  return snap.data() as T & { status?: CmsStatus };
}

function withWriteMeta(data: DocumentData, meta?: CmsWriteMeta): DocumentData {
  if (!meta?.uid) return data;

  return {
    ...data,
    updatedBy: { uid: meta.uid, ...(meta.email ? { email: meta.email } : {}) },
    ...(meta.restoredFromVersionId
      ? { restoredFromVersionId: meta.restoredFromVersionId }
      : {}),
  };
}

export async function saveSingletonDoc(
  docId: string,
  data: DocumentData,
  status: CmsStatus,
  meta?: CmsWriteMeta,
) {
  const db = getClientDb();
  const ref = doc(db, CMS_COLLECTIONS.singletons, docId);
  await setDoc(
    ref,
    {
      ...sanitizeForFirestore(withWriteMeta(data, meta)),
      status,
      updatedAt: serverTimestamp(),
      ...(status === "published" ? { publishedAt: serverTimestamp() } : {}),
    },
    { merge: true },
  );
}

export async function listCollectionDocs<T extends { id: string }>(
  collectionName: string,
  orderField = "order",
) {
  const db = getClientDb();
  const q = query(collection(db, collectionName), orderBy(orderField, "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function listCollectionDocsByDate<T extends { id: string }>(
  collectionName: string,
) {
  const db = getClientDb();
  const q = query(collection(db, collectionName), orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getCollectionDoc<T>(collectionName: string, id: string) {
  const db = getClientDb();
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

export async function saveCollectionDoc(
  collectionName: string,
  id: string | null,
  data: DocumentData,
  status: CmsStatus,
  meta?: CmsWriteMeta,
) {
  const db = getClientDb();
  const docRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
  await setDoc(
    docRef,
    {
      ...sanitizeForFirestore(withWriteMeta(data, meta)),
      status,
      updatedAt: serverTimestamp(),
      ...(status === "published" ? { publishedAt: serverTimestamp() } : {}),
    },
    { merge: true },
  );
  return docRef.id;
}

export async function deleteCollectionDoc(collectionName: string, id: string) {
  const db = getClientDb();
  await deleteDoc(doc(db, collectionName, id));
}

export async function listLeads(type?: string) {
  const db = getClientDb();
  const q = type
    ? query(
        collection(db, CMS_COLLECTIONS.leads),
        where("type", "==", type),
        orderBy("createdAt", "desc"),
      )
    : query(collection(db, CMS_COLLECTIONS.leads), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? undefined,
  }));
}

export { CMS_COLLECTIONS, CMS_SINGLETON_IDS };
