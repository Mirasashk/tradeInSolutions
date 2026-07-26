"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { RecaptchaScript } from "@/components/shared/RecaptchaScript";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";
import { executeRecaptcha } from "@/lib/recaptcha";
import {
  valueEstimatorFormClientSchema,
  type ValueEstimatorFormClientValues,
} from "@/lib/validators/forms";

export function ValueEstimatorForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ValueEstimatorFormClientValues>({
    resolver: zodResolver(valueEstimatorFormClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleMileage: "",
      condition: "good",
    },
  });

  async function onSubmit(values: ValueEstimatorFormClientValues) {
    setStatus("loading");
    trackFormSubmit("value_estimator");

    try {
      const recaptchaToken = await executeRecaptcha("value_estimator");
      const response = await fetch("/api/value-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      const data = (await response.json()) as {
        estimate?: { low: number; high: number };
        error?: string;
      };

      if (!response.ok) throw new Error(data.error ?? "Failed");
      setEstimate(data.estimate ?? null);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to calculate estimate. Please schedule an appraisal.");
    }
  }

  return (
    <>
      <RecaptchaScript />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={() => trackFormStart("value_estimator")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="vehicleMileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={status === "loading"} className="w-full">
            Get Estimate
          </Button>
          {estimate ? (
            <p className="text-center text-lg font-semibold text-brand-navy">
              Estimated range: ${estimate.low.toLocaleString()} – $
              {estimate.high.toLocaleString()}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </form>
      </Form>
    </>
  );
}
