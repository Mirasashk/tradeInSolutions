import { onRequest } from "firebase-functions/v2/https";
import type { Request, Response } from "express";

import { applyCors, handleOptions } from "./lib/cors";
import { saveLead } from "./lib/firestore";
import { verifyRecaptcha, recaptchaSecretKey } from "./lib/recaptcha";
import {
  contactFormToEmail,
  resendApiKey,
  resendFromEmail,
  sendLeadEmail,
} from "./lib/resend";
import { contactFormSchema } from "./lib/validate";

export const contactForm = onRequest(
  {
    region: "us-west1",
    secrets: [recaptchaSecretKey, resendApiKey, contactFormToEmail, resendFromEmail],
  },
  async (req: Request, res: Response) => {
    applyCors(req, res);
    if (handleOptions(req, res)) {
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const parsed = contactFormSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid form data" });
        return;
      }

      const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken, "contact");
      if (!recaptcha.ok) {
        res.status(400).json({ error: recaptcha.error });
        return;
      }

      const { name, email, phone, message } = parsed.data;
      await saveLead("contact", { name, email, phone, message });
      await sendLeadEmail({
        subject: `New contact form submission from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone ?? "N/A"}</p><p><strong>Message:</strong> ${message}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("contactForm error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
