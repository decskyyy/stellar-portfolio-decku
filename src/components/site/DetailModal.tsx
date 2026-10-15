"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { portfolioSpring } from "@/lib/motion";
import { useEffect, useRef } from "react";

const quickModalExit = { duration: 0.18, ease: "easeOut" as const };

export default function DetailModal({
  open,
  title,
  eyebrow,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const shouldReduceMotion = useReducedMotion();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused.current?.isConnected) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={
            shouldReduceMotion
              ? undefined
              : { opacity: 0, transition: quickModalExit }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : portfolioSpring
          }
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close dialog"
            tabIndex={-1}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-modal-title"
            tabIndex={-1}
            className="relative max-h-[min(720px,calc(100vh-2rem))] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-muted bg-base-surface p-6 text-ink shadow-2xl sm:p-8"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.97, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 0,
                    scale: 0.98,
                    y: 8,
                    transition: quickModalExit,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : portfolioSpring
            }
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-base-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
            {eyebrow && (
              <p className="pr-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
                {eyebrow}
              </p>
            )}
            <h2 id="detail-modal-title" className="mt-2 pr-8 text-2xl font-bold">
              {title}
            </h2>
            <div className="mt-6 text-sm leading-7 text-ink-muted">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
