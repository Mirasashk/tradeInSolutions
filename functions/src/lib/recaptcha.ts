import { defineSecret } from "firebase-functions/params";

export const recaptchaSecretKey = defineSecret("RECAPTCHA_SECRET_KEY");

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
): Promise<{ ok: true; score: number } | { ok: false; error: string }> {
  if (process.env.FUNCTIONS_EMULATOR === "true" && token === "development-token") {
    return { ok: true, score: 1 };
  }

  const secret = recaptchaSecretKey.value();
  const params = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = (await response.json()) as RecaptchaResponse;

  if (!data.success) {
    return { ok: false, error: "reCAPTCHA verification failed" };
  }

  if (data.action !== expectedAction) {
    return { ok: false, error: "Invalid reCAPTCHA action" };
  }

  const score = data.score ?? 0;
  if (score < 0.5) {
    return { ok: false, error: "Request flagged as suspicious" };
  }

  return { ok: true, score };
}
