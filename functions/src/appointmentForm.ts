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

      const {
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        notes,
      } = parsed.data;
      await saveLead("appointment", {
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        notes,
      });
      await sendLeadEmail({
        subject: `New appointment request from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Date:</strong> ${preferredDate}</p><p><strong>Time:</strong> ${preferredTime}</p><p><strong>Vehicle:</strong> ${[vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(" ") || "N/A"}</p><p><strong>Notes:</strong> ${notes ?? "N/A"}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("appointmentForm error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
