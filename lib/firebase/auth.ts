import { getFirebaseApp } from "@/lib/firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

export function getClientAuth() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured.");
  }
  return getAuth(app);
}

export async function signInAdmin(email: string, password: string) {
  const auth = getClientAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin() {
  const auth = getClientAuth();
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const auth = getClientAuth();
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const auth = getClientAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
