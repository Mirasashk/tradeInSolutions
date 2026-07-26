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
  vehicleMileage: z.string().optional(),
  conditionDescription: z.string().optional(),
  hasPreviousOffer: z.boolean().optional(),
  photoUrls: z.array(z.string().url()).max(5).optional(),
  notes: z.string().optional(),
  recaptchaToken: recaptchaField,
});

export const beatOfferFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  competitorOffer: z.string().min(1),
  vehicleDescription: z.string().optional(),
  recaptchaToken: recaptchaField,
});

export const valueEstimatorFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  vehicleYear: z.string().min(4),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleMileage: z.string().min(1),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  recaptchaToken: recaptchaField,
});

export const contactFormClientSchema = contactFormSchema.omit({ recaptchaToken: true });
export const appointmentFormClientSchema = appointmentFormSchema.omit({
  recaptchaToken: true,
});
export const beatOfferFormClientSchema = beatOfferFormSchema.omit({
  recaptchaToken: true,
});
export const valueEstimatorFormClientSchema = valueEstimatorFormSchema.omit({
  recaptchaToken: true,
});

export type ContactFormClientValues = z.infer<typeof contactFormClientSchema>;
export type AppointmentFormClientValues = z.infer<typeof appointmentFormClientSchema>;
export type BeatOfferFormClientValues = z.infer<typeof beatOfferFormClientSchema>;
export type ValueEstimatorFormClientValues = z.infer<
  typeof valueEstimatorFormClientSchema
>;

export function estimateVehicleValue(input: {
  vehicleYear: string;
  vehicleMileage: string;
  condition: string;
}): { low: number; high: number } {
  const year = Number(input.vehicleYear);
  const mileage = Number(input.vehicleMileage.replace(/\D/g, ""));
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  const base = Math.max(3000, 25000 - age * 1200 - mileage * 0.08);

  const multipliers: Record<string, number> = {
    excellent: 1.1,
    good: 1,
    fair: 0.85,
    poor: 0.65,
  };
  const mult = multipliers[input.condition] ?? 1;
  const mid = Math.round(base * mult);
  return {
    low: Math.round(mid * 0.9),
    high: Math.round(mid * 1.15),
  };
}
