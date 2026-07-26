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
import { estimateVehicleValue, valueEstimatorFormSchema } from "./lib/validate";

export const valueEstimatorForm = onRequest(
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
      const parsed = valueEstimatorFormSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid form data" });
        return;
      }

      const recaptcha = await verifyRecaptcha(
        parsed.data.recaptchaToken,
        "value_estimator",
      );
      if (!recaptcha.ok) {
        res.status(400).json({ error: recaptcha.error });
        return;
      }

      const estimate = estimateVehicleValue(parsed.data);
      await saveLead("value_estimator", { ...parsed.data, estimate });
      await sendLeadEmail({
        subject: `Value estimator lead from ${parsed.data.name}`,
        html: `<p><strong>Name:</strong> ${parsed.data.name}</p>
<p><strong>Vehicle:</strong> ${parsed.data.vehicleYear} ${parsed.data.vehicleMake} ${parsed.data.vehicleModel}</p>
<p><strong>Estimate:</strong> $${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}</p>`,
      });

      res.status(200).json({ success: true, estimate });
    } catch (error) {
      console.error("valueEstimatorForm error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
