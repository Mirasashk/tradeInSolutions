"use client";

import { motion } from "framer-motion";

export function HeroSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-brand-navy px-4 py-20 text-white"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-white/85">{subtitle}</p>
        {children ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
        ) : null}
      </div>
    </motion.section>
  );
}
