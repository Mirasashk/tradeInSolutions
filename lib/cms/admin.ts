import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: Firestore | undefined;

function initCredentials() {
  if (getApps().length) {
    return getApps()[0];
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const serviceAccount = JSON.parse(json) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
      projectId:
        serviceAccount.projectId ??
        (serviceAccount as { project_id?: string }).project_id,
    });
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.GCLOUD_PROJECT ??
    process.env.GOOGLE_CLOUD_PROJECT;

  if (projectId && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ projectId });
  }

  return undefined;
}

export function isCmsConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
  );
}

export function getAdminDb(): Firestore | null {
  if (typeof window !== "undefined") {
    return null;
  }

  if (!db) {
    app = initCredentials();
    if (!app) {
      return null;
    }
    db = getFirestore(app);
  }

  return db;
}

export function timestampToIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString();
  }
  return undefined;
}
