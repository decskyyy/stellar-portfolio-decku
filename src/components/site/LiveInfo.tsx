"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { portfolioSpring } from "@/lib/motion";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function LiveInfo() {
  const [now, setNow] = useState<Date | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    setNow(new Date());
    updateViewport();
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    window.addEventListener("resize", updateViewport);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const reveal = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      ...(shouldReduceMotion ? { duration: 0 } : portfolioSpring),
    },
  };

  return (
    <>
      <header className="mobile-clock-header sticky top-0 z-40 border-b border-base-muted/70 bg-canvas/90 backdrop-blur-md md:hidden">
        <div
          className="mx-auto flex h-12 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6"
          aria-label={now ? dateFormatter.format(now) : "Local date and time"}
        >
          <time
            className="font-mono text-sm font-semibold tabular-nums text-ink"
            dateTime={now?.toISOString()}
          >
            {now ? timeFormatter.format(now) : "--:--:--"}
          </time>
          <span className="truncate text-right text-xs text-ink-muted">
            {now ? dateFormatter.format(now) : "Local date"}
          </span>
        </div>
      </header>
      <motion.div
        className="live-info live-info-time"
        aria-label={
          now
            ? `${timeFormatter.format(now)}, ${dateFormatter.format(now)}`
            : "Local time"
        }
        {...reveal}
      >
        <time dateTime={now?.toISOString()}>
          {now ? timeFormatter.format(now) : "--:--:--"}
        </time>
        {now && (
          <span className="live-info-date">{dateFormatter.format(now)}</span>
        )}
      </motion.div>
      <motion.div
        className="live-info live-info-screen"
        aria-label={`Screen size ${viewport.width} by ${viewport.height}`}
        {...reveal}
      >
        {viewport.width} x {viewport.height}
      </motion.div>
    </>
  );
}
