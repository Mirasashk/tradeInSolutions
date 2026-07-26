"use client";

import { useEffect } from "react";

import { initScrollTracking } from "@/lib/analytics";

export function ScrollTracker() {
  useEffect(() => initScrollTracking(), []);
  return null;
}
