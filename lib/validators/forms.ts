import { z } from "zod";

const recaptchaField = z.string().min(1, "reCAPTCHA verification failed");

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: recaptchaField,
});

export const appointmentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  preferredDate: z.string().min(1, "Select a preferred date"),
  preferredTime: z.string().min(1, "Select a preferred time"),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  notes: z.string().optional(),
  recaptchaToken: recaptchaField,
});

export const contactFormClientSchema = contactFormSchema.omit({ recaptchaToken: true });
export const appointmentFormClientSchema = appointmentFormSchema.omit({
  recaptchaToken: true,
});

export type ContactFormClientValues = z.infer<typeof contactFormClientSchema>;
export type AppointmentFormClientValues = z.infer<typeof appointmentFormClientSchema>;
