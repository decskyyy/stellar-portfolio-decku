'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { portfolioSpring } from '@/lib/motion';

/** Pembungkus animasi: fade + geser naik saat elemen masuk viewport. */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
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
