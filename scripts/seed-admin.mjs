#!/usr/bin/env node
/**
 * Seed an admin user document in Firestore.
 * Usage: ADMIN_UID=... ADMIN_EMAIL=... node scripts/seed-admin.mjs
 *
 * Credentials (pick one):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *   FIREBASE_SERVICE_ACCOUNT_JSON=/path/to/service-account.json
 *   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
 */
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { initFirebaseAdmin } from "./lib/load-service-account.mjs";

const uid = process.env.ADMIN_UID;
const email = process.env.ADMIN_EMAIL;

if (!uid || !email) {
  console.error("Set ADMIN_UID and ADMIN_EMAIL environment variables.");
  process.exit(1);
}

const app = initFirebaseAdmin();
const db = getFirestore(app);

await db.collection("admins").doc(uid).set({
  email,
  role: "admin",
  createdAt: FieldValue.serverTimestamp(),
});

console.log(`Admin document created for ${email} (${uid})`);
