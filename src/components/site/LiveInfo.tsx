"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
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
    initial: shouldReduceMotion ? false : { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.6,
      ease: "easeOut" as const,
    },
  };

  return (
    <>
      <motion.div
        className="live-info live-info-time"
        aria-label={
          now
            ? `${timeFormatter.format(now)}, ${dateFormatter.format(now)}`
            : "Waktu lokal"
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
        aria-label={`Ukuran layar ${viewport.width} kali ${viewport.height}`}
        {...reveal}
      >
        {viewport.width} x {viewport.height}
      </motion.div>
    </>
  );
}
