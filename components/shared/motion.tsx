"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Fades and slides content in when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/** Parent container that staggers its `StaggerItem` children on scroll. */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Child of `Stagger`; animates in sequence with its siblings. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

/** Small uppercase section label with a gold accent line. */
export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
      <span aria-hidden className="h-px w-8 bg-brand-gold" />
      {children}
      <span aria-hidden className="h-px w-8 bg-brand-gold" />
    </span>
  );
}
