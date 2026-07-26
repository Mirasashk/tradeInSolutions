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
import { appointmentFormSchema } from "./lib/validate";

export const appointmentForm = onRequest(
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
      const parsed = appointmentFormSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid form data" });
        return;
      }

      const recaptcha = await verifyRecaptcha(
        parsed.data.recaptchaToken,
        "appointment",
      );
      if (!recaptcha.ok) {
        res.status(400).json({ error: recaptcha.error });
        return;
      }

      const data = parsed.data;
      await saveLead("appointment", data);
      await sendLeadEmail({
        subject: `New appointment request from ${data.name}`,
        html: `<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>Date:</strong> ${data.preferredDate}</p>
<p><strong>Time:</strong> ${data.preferredTime}</p>
<p><strong>Vehicle:</strong> ${[data.vehicleYear, data.vehicleMake, data.vehicleModel].filter(Boolean).join(" ") || "N/A"}</p>
<p><strong>Mileage:</strong> ${data.vehicleMileage ?? "N/A"}</p>
<p><strong>Condition:</strong> ${data.conditionDescription ?? "N/A"}</p>
<p><strong>Previous offer:</strong> ${data.hasPreviousOffer ? "Yes" : "No"}</p>
<p><strong>Photos:</strong> ${data.photoUrls?.length ? data.photoUrls.join(", ") : "None"}</p>
<p><strong>Notes:</strong> ${data.notes ?? "N/A"}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("appointmentForm error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
