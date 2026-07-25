"use client";

import Script from "next/script";

import { getRecaptchaScriptSrc } from "@/lib/recaptcha";

export function RecaptchaScript() {
  const src = getRecaptchaScriptSrc();

  if (!src) {
    return null;
  }

  return <Script src={src} strategy="afterInteractive" />;
}
