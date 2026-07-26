import { initializeApp, getApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let db: Firestore | undefined;

function ensureDefaultApp() {
  try {
    return getApp();
  } catch {
    return initializeApp();
  }
}

/** Shared Firestore instance with guaranteed default-app initialization. */
export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(ensureDefaultApp());
  }
  return db;
}
