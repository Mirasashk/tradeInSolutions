import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";

/**
 * Load a Firebase service account from:
 * - GOOGLE_APPLICATION_CREDENTIALS (file path)
 * - FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON or path to .json file)
 */
export function loadServiceAccount() {
  const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gacPath) {
    const absolute = resolve(gacPath);
    return JSON.parse(readFileSync(absolute, "utf8"));
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!jsonEnv) {
    return null;
  }

  const trimmed = jsonEnv.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const filePath = resolve(trimmed);
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, "utf8"));
  }

  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_JSON must be inline JSON or a path to a .json key file. " +
      "Alternatively set GOOGLE_APPLICATION_CREDENTIALS to the key file path.",
  );
}

export function initFirebaseAdmin() {
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = loadServiceAccount();
  if (serviceAccount) {
    return initializeApp({ credential: cert(serviceAccount) });
  }

  return initializeApp();
}
