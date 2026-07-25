import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

function getDb() {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
}

export async function saveLead(
  type: "contact" | "appointment",
  data: Record<string, unknown>,
) {
  await getDb()
    .collection("leads")
    .add({
      type,
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
}
