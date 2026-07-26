"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { BadgeCheck, ChevronDown, Clock, Phone, Wallet } from "lucide-react";

import { CmsImage } from "@/components/shared/CmsImage";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";
import type { CmsImage as CmsImageType } from "@/types";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const trustPoints = [
  { icon: Clock, text: "45-minute process" },
  { icon: Wallet, text: "Same-day payment" },
  { icon: BadgeCheck, text: "Offer good 7 days / 350 miles" },
];

type HomeHeroProps = {
  headline: string;
  subheadline?: string;
  backgroundImage?: CmsImageType | null;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export function HomeHero({
  headline,
  subheadline,
  backgroundImage,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HomeHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduceMotion ? "0%" : "24%"],
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60]);

  const isPhoneCta = secondaryCtaHref.startsWith("tel:");

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] items-center justify-center overflow-hidden bg-brand-navy text-white"
    >
      {/* Parallax background layers */}
      <motion.div aria-hidden style={{ y: bgY }} className="absolute inset-[-10%]">
        {backgroundImage?.url ? (
          <CmsImage
            image={backgroundImage}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-25"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/80 to-brand-navy" />
        <div className="absolute left-1/2 top-0 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative mx-auto max-w-4xl px-4 py-24 text-center"
      >
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold backdrop-blur"
          >
            Orange County &amp; San Diego • Free Appraisals
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-bold leading-tight md:text-6xl"
          >
            {headline}
          </motion.h1>

          {subheadline ? (
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/80 md:text-xl"
            >
              {subheadline}
            </motion.p>
          ) : null}

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href={primaryCtaHref}
              onClick={() => trackCtaClick("hero_primary")}
              className="rounded-md bg-brand-gold px-8 py-3.5 text-base font-semibold text-brand-navy shadow-lg shadow-brand-gold/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              onClick={() =>
                isPhoneCta ? trackPhoneClick("hero") : trackCtaClick("hero_secondary")
              }
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              {isPhoneCta ? <Phone className="h-4 w-4" /> : null}
              {secondaryCtaLabel}
            </Link>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {trustPoints.map((point) => (
              <li
                key={point.text}
                className="flex items-center gap-2 text-sm font-medium text-white/75"
              >
                <point.icon className="h-4 w-4 text-brand-gold" />
                {point.text}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
