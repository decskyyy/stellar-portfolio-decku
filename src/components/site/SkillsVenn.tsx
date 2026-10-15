"use client";

import type { Profile } from "@/lib/types";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";

const positions = ["top", "left", "right", "bottom"] as const;
const focusAreas = [
  "Incident response",
  "ERP & POS support",
  "SQL diagnostics",
  "System troubleshooting",
];

export default function SkillsVenn({
  profile,
}: {
  profile: Profile;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hasHover, setHasHover] = useState(true);
  const [suppressPointerHover, setSuppressPointerHover] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const circlesAreOpen = !showAbout && !hasHover;
  const avatarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    const updateHoverCapability = () => setHasHover(hoverQuery.matches);

    updateHoverCapability();
    hoverQuery.addEventListener("change", updateHoverCapability);
    return () =>
      hoverQuery.removeEventListener("change", updateHoverCapability);
  }, []);

  useEffect(() => {
    if (!suppressPointerHover) return;

    const handlePointerMove = (event: PointerEvent) => {
      const avatarBounds = avatarRef.current?.getBoundingClientRect();
      if (
        !avatarBounds ||
        event.clientX < avatarBounds.left ||
        event.clientX > avatarBounds.right ||
        event.clientY < avatarBounds.top ||
        event.clientY > avatarBounds.bottom
      ) {
        setSuppressPointerHover(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [suppressPointerHover]);

  const toggleAbout = useCallback(() => {
    setShowAbout((prev) => !prev);
  }, []);

  const initials = profile.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const about = profile.bio.trim();

  const animConfig = {
    ease: [0.16, 1, 0.3, 1] as const,
    duration: shouldReduceMotion ? 0 : 0.24,
  };

  return (
    <div
      id="skills"
      className={`skill-venn-container scroll-mt-24${showAbout ? " skill-venn-container-about-open" : ""}`}
    >
      {/* Venn diagram */}
      <div
        className={`skill-venn${showAbout ? " skill-venn-about-open" : ""}`}
        data-hover-dismissed={suppressPointerHover ? "true" : undefined}
      >
        {/* Open the diagram and reveal its labels while the avatar is hovered or focused. */}
        <AnimatePresence>
          <>
            {positions.map((position) => (
              <motion.div
                key={position}
                className={`skill-venn-circle skill-venn-circle-${position}`}
                initial={false}
                animate={{
                  opacity: showAbout ? 0 : circlesAreOpen ? 0.92 : 0.38,
                  scale: circlesAreOpen ? 1.035 : 0.94,
                }}
                transition={{
                  ...animConfig,
                }}
                style={{ transformOrigin: "center", pointerEvents: "none" }}
                aria-hidden="true"
              />
            ))}

            {focusAreas.map((label, index) => (
              <span
                key={label}
                className={`skill-venn-label-anchor skill-venn-label-anchor-${positions[index]}`}
                aria-hidden={showAbout}
              >
                <motion.span
                  className="skill-venn-label"
                  initial={false}
                  animate={{
                    opacity: circlesAreOpen ? 1 : 0,
                    y: circlesAreOpen ? 0 : 4,
                    scale: circlesAreOpen ? 1 : 0.94,
                  }}
                  transition={{
                    ...animConfig,
                    delay: circlesAreOpen ? index * 0.045 : 0,
                  }}
                >
                  {label}
                </motion.span>
              </span>
            ))}

          </>
        </AnimatePresence>

        {/* Avatar - click to show About Me */}
        <div
          className={`skill-venn-avatar-position${showAbout ? " skill-venn-avatar-position-expanded" : ""}`}
        >
          <motion.button
            type="button"
            className="skill-venn-avatar"
            onClick={(event) => {
              if (showAbout && hasHover && event.detail > 0) {
                setSuppressPointerHover(true);
              }
              toggleAbout();
            }}
            ref={avatarRef}
            aria-expanded={showAbout}
            aria-label={showAbout ? "Close about me" : "Show about me"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
          >
            <div className="skill-venn-photo">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} />
              ) : (
                <span className="skill-venn-initials">{initials}</span>
              )}
            </div>
          </motion.button>
        </div>
      </div>

      {/* Hint text */}
      {!showAbout && (
        <p className="mt-2 text-xs text-ink-faint opacity-60">
          Click for about
        </p>
      )}

      {/* About Section - click avatar to toggle */}
      <AnimatePresence>
        {showAbout && about && (
          <motion.div
            className="skill-venn-about"
            role="region"
            aria-label="About me"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="skill-venn-about-text">{about}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
