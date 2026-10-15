"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { portfolioSpring } from "@/lib/motion";

export default function RevealOnLoad({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...(shouldReduceMotion ? { duration: 0 } : portfolioSpring),
        delay: shouldReduceMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
