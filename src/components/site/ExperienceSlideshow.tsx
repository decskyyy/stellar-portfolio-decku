"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import type { Experience } from "@/lib/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

function formatDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

const SWIPE_THRESHOLD = 50;
const AUTO_PLAY_INTERVAL = 5500;
const DESCRIPTION_PREVIEW_LENGTH = 150;

function getDescriptionPreview(description: string) {
  const normalized = description.replace(/\\n/g, "\n").trim();
  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const preview = (lines.length > 1 ? lines : normalized.split(/(?<=[.!?])\s+/))
    .slice(0, 2)
    .join(" ");

  if (preview.length <= DESCRIPTION_PREVIEW_LENGTH) return preview;

  const shortened = preview
    .slice(0, DESCRIPTION_PREVIEW_LENGTH)
    .replace(/\s+\S*$/, "");
  return `${shortened}…`;
}

export default function ExperienceSlideshow({
  items,
}: {
  items: Experience[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isHovered = useRef(false);
  const isFocused = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const slideTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((previousIndex) => {
        if (newDirection === 1) {
          return previousIndex === items.length - 1 ? 0 : previousIndex + 1;
        }
        return previousIndex === 0 ? items.length - 1 : previousIndex - 1;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length <= 1 || shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      if (!isHovered.current && !isFocused.current && !document.hidden) {
        paginate(1);
      }
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [items.length, paginate, shouldReduceMotion]);

  if (!items.length) return null;

  const current = items[currentIndex] ?? items[0];
  const variants = {
    enter: (slideDirection: number) => ({
      x: slideDirection > 0 ? 36 : -36,
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (slideDirection: number) => ({
      x: slideDirection > 0 ? -36 : 36,
      opacity: 0,
      scale: 0.985,
    }),
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      paginate(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      paginate(-1);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      isFocused.current = false;
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-xl border border-base-muted bg-base-surface/50 p-4 sm:p-5"
          role="region"
          aria-roledescription="carousel"
          aria-label="Professional experience"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocusCapture={() => {
            isFocused.current = true;
          }}
          onBlurCapture={handleBlur}
          onMouseEnter={() => {
            isHovered.current = true;
          }}
          onMouseLeave={() => {
            isHovered.current = false;
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              id="current-experience-slide"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit={shouldReduceMotion ? { opacity: 0 } : "exit"}
              transition={slideTransition}
              drag={items.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              onDragEnd={(_, info) => {
                const swipe = Math.abs(info.offset.x) * info.velocity.x;
                if (swipe < -SWIPE_THRESHOLD) {
                  paginate(1);
                } else if (swipe > SWIPE_THRESHOLD) {
                  paginate(-1);
                }
              }}
              className="min-h-[136px] sm:min-h-[112px]"
              aria-live="polite"
            >
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="line-clamp-2 break-words text-base font-semibold text-ink">
                    {current.role_title}
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-ink-faint">
                    {formatDate(current.start_date)} &ndash;{" "}
                    {current.is_current ? "Present" : formatDate(current.end_date)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-accent-soft">
                  {current.company}
                  {current.location ? ` · ${current.location}` : ""}
                </p>
                {current.description && (
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted sm:text-sm">
                    {getDescriptionPreview(current.description)}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="mt-4 flex min-h-10 items-center border-t border-base-muted/50 pt-3">
              <div
                className="flex items-center gap-1"
                role="group"
                aria-label="Choose experience"
              >
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      isFocused.current = false;
                      if (index === currentIndex) return;
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    aria-label={`Go to experience ${index + 1}: ${item.role_title}`}
                    aria-current={index === currentIndex ? "true" : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 rounded-full transition-[width,background-color] duration-300 ease-out ${
                        index === currentIndex
                          ? "w-6 bg-accent"
                          : "w-2 bg-base-muted hover:bg-ink-faint"
                      }`}
                    />
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
