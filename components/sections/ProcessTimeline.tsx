"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Banknote, CalendarCheck, SearchCheck } from "lucide-react";

import {
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";

const steps = [
  {
    icon: CalendarCheck,
    title: "Make an Appointment",
    description:
      "Schedule your free appraisal online or by phone — no obligation, no pressure.",
  },
  {
    icon: SearchCheck,
    title: "Inspection & Appraisal",
    description:
      "Our expert appraiser inspects your vehicle, explains every detail, and answers all your questions.",
  },
  {
    icon: Banknote,
    title: "Get a Check",
    description:
      "Accept the offer and walk out with a check drawn on immediately available funds — same day.",
  },
];

export function ProcessTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal className="text-center">
        <SectionEyebrow>How It Works</SectionEyebrow>
        <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
          Three Simple Steps, 45 Minutes or Less
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          From appraisal inspection to documentation and payment, the entire process
          takes 45 minutes or less.
        </p>
      </Reveal>

      <div className="relative mt-14">
        {/* Connector line that draws in on scroll (desktop only) */}
        <motion.div
          aria-hidden
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute left-[16.67%] right-[16.67%] top-7 hidden h-0.5 origin-left bg-brand-gold/40 md:block"
        />

        <Stagger className="grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerItem key={step.title} className="relative text-center">
              <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold shadow-md ring-4 ring-background">
                <step.icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-gold">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-brand-navy">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
