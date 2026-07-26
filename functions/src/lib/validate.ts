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
  vehicleMileage: z.string().optional(),
  conditionDescription: z.string().optional(),
  hasPreviousOffer: z.boolean().optional(),
  photoUrls: z.array(z.string().url()).max(5).optional(),
  notes: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

export const beatOfferFormSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(7),
  competitorOffer: z.string().min(1),
  vehicleDescription: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

export const valueEstimatorFormSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(7),
  vehicleYear: z.string().min(4),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleMileage: z.string().min(1),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  recaptchaToken: z.string().min(1),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
export type AppointmentFormPayload = z.infer<typeof appointmentFormSchema>;
export type BeatOfferFormPayload = z.infer<typeof beatOfferFormSchema>;
export type ValueEstimatorFormPayload = z.infer<typeof valueEstimatorFormSchema>;

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
