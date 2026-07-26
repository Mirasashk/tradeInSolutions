"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Car, HelpCircle, Scale } from "lucide-react";

import {
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { trackCtaClick } from "@/lib/analytics";

const actions = [
  {
    title: "How It Works",
    description: "See our simple 3-step process from appointment to check.",
    href: "/about-us/",
    icon: HelpCircle,
  },
  {
    title: "Got Previous Offers?",
    description: "Bring any written offer — we'll compare it head to head.",
    href: "/faq/#compare-offers",
    icon: Scale,
  },
  {
    title: "Value My Car",
    description: "Get a quick estimate range for your vehicle in minutes.",
    href: "/value-estimator/",
    icon: Car,
  },
  {
    title: "Schedule Appointment",
    description: "Book your free, no-obligation appraisal today.",
    href: "/schedule-appointment/",
    icon: Calendar,
  },
];

export function QuickActions() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal className="text-center">
        <SectionEyebrow>Get Started</SectionEyebrow>
        <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
          Everything You Need to Sell Your Car
        </h2>
      </Reveal>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <StaggerItem key={action.title} className="h-full">
            <Link
              href={action.href}
              onClick={() => trackCtaClick(`quick_action_${action.title}`)}
              className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
                <action.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-navy">
                {action.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {action.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
