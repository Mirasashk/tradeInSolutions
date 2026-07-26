"use client";

import { useEffect } from "react";

export function LiveChat({ scriptUrl }: { scriptUrl?: string }) {
  useEffect(() => {
    if (!scriptUrl || typeof document === "undefined") return;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [scriptUrl]);

  return null;
}
