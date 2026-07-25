"use client";

import { useEffect } from "react";

import { initFirebasePerformance } from "@/lib/firebase";

export function FirebaseInit() {
  useEffect(() => {
    void initFirebasePerformance();
  }, []);

  return null;
}
