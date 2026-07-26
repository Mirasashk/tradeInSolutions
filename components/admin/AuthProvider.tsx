"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { getClientAuth } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getAdminProfile } from "@/lib/firebase/firestore";
import type { AdminUser } from "@/types";

type AuthState = {
  user: User | null;
  admin: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  configured: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  admin: null,
  loading: true,
  isAdmin: false,
  configured: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const configured = isFirebaseConfigured();
  const [loading, setLoading] = useState(configured);

  const loadAdmin = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setAdmin(null);
      return;
    }
    const profile = await getAdminProfile(authUser.uid);
    setAdmin(profile);
  }, []);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      await loadAdmin(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [configured, loadAdmin]);

  const value = useMemo(
    () => ({
      user,
      admin,
      loading,
      isAdmin: Boolean(user && admin),
      configured,
    }),
    [user, admin, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
