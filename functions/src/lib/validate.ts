import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  recaptchaToken: z.string().min(1),
});

export const appointmentFormSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(7),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  notes: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
export type AppointmentFormPayload = z.infer<typeof appointmentFormSchema>;
