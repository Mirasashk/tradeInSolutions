"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

/** Compact navy hero for inner pages, matching the landing page design. */
export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-navy px-4 py-20 text-white md:py-28">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-2/3 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-3xl text-center"
      >
        {eyebrow ? (
          <motion.p
            variants={item}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold"
          >
            <span aria-hidden className="h-px w-8 bg-brand-gold" />
            {eyebrow}
            <span aria-hidden className="h-px w-8 bg-brand-gold" />
          </motion.p>
        ) : null}
        <motion.h1
          variants={item}
          className="text-balance text-4xl font-bold leading-tight md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/75"
          >
            {subtitle}
          </motion.p>
        ) : null}
        {children ? (
          <motion.div variants={item} className="mt-8">
            {children}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
