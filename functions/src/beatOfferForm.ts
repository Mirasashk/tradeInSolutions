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
import { beatOfferFormSchema } from "./lib/validate";

export const beatOfferForm = onRequest(
  {
    region: "us-west1",
    secrets: [recaptchaSecretKey, resendApiKey, contactFormToEmail, resendFromEmail],
  },
  async (req: Request, res: Response) => {
    applyCors(req, res);
    if (handleOptions(req, res)) return;

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const parsed = beatOfferFormSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid form data" });
        return;
      }

      const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken, "beat_offer");
      if (!recaptcha.ok) {
        res.status(400).json({ error: recaptcha.error });
        return;
      }

      await saveLead("beat_offer", parsed.data);
      await sendLeadEmail({
        subject: `Beat your offer request from ${parsed.data.name}`,
        html: `<p><strong>Name:</strong> ${parsed.data.name}</p>
<p><strong>Email:</strong> ${parsed.data.email}</p>
<p><strong>Phone:</strong> ${parsed.data.phone}</p>
<p><strong>Competitor offer:</strong> ${parsed.data.competitorOffer}</p>
<p><strong>Vehicle:</strong> ${parsed.data.vehicleDescription ?? "N/A"}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("beatOfferForm error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
