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
import { Textarea } from "@/components/ui/textarea";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";
import { executeRecaptcha } from "@/lib/recaptcha";
import {
  beatOfferFormClientSchema,
  type BeatOfferFormClientValues,
} from "@/lib/validators/forms";

export function BeatOfferForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<BeatOfferFormClientValues>({
    resolver: zodResolver(beatOfferFormClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      competitorOffer: "",
      vehicleDescription: "",
    },
  });

  async function onSubmit(values: BeatOfferFormClientValues) {
    setStatus("loading");
    trackFormSubmit("beat_offer");

    try {
      const recaptchaToken = await executeRecaptcha("beat_offer");
      const response = await fetch("/api/beat-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please call us directly.");
    }
  }

  return (
    <>
      <RecaptchaScript />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} onFocus={() => trackFormStart("beat_offer")} />
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
          <FormField
            control={form.control}
            name="vehicleDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <FormControl>
                  <Input placeholder="2020 Honda Accord" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="competitorOffer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competitor Offer Details</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Paste or describe the written offer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={status === "loading"} className="w-full">
            Submit Offer for Review
          </Button>
          {status === "success" ? (
            <p className="text-sm text-green-700">
              We&apos;ll review your offer and contact you shortly.
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
