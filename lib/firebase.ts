import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import type { FirebasePerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let perf: FirebasePerformance | undefined;

export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
    return undefined;
  }

  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }

  return app;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.appId);
}

export async function initFirebasePerformance(): Promise<
  FirebasePerformance | undefined
> {
  if (typeof window === "undefined") {
    return undefined;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || perf) {
    return perf;
  }

  const { getPerformance: loadPerformance } = await import("firebase/performance");
  perf = loadPerformance(firebaseApp);
  return perf;
}
