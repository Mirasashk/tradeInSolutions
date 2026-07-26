"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { Stagger, StaggerItem } from "@/components/shared/motion";

const stats = [
  { value: 28, suffix: "+", label: "Years of Experience" },
  { value: 45, suffix: " min", label: "Or Less, Start to Finish" },
  { value: 7, suffix: " days", label: "Offer Guarantee (or 350 miles)" },
  { value: 1000, suffix: "s", label: "Of Happy Customers" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  const shown = reduceMotion ? value : display;

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounters() {
  return (
    <section className="bg-brand-navy px-4 py-16 text-white">
      <Stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-10 text-center lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <p className="text-4xl font-bold text-brand-gold md:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium text-white/70">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
