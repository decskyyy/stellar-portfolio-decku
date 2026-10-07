"use client";

import type { Profile, Skill } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { getPublicSkillCategory } from "@/lib/skill-category";

const positions = ["top", "left", "right", "bottom"] as const;
const focusAreas = ["Users", "Applications", "Systems", "Operations"];

export default function SkillsVenn({
  profile,
  skills,
}: {
  profile: Profile;
  skills: Skill[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const touchPointer = useRef(false);
  const isOpen = expanded || hovered || focused;
  const savedCategories = [
    ...new Set(skills.map(getPublicSkillCategory)),
  ].slice(0, positions.length);
  const categories =
    savedCategories.length > 0 ? savedCategories : focusAreas;
  const initials = profile.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      id="skills"
      className="scroll-mt-24"
      aria-label="Skills category map"
    >
      <div
        className="skill-venn"
        role="group"
        aria-label={`Focus categories: ${categories.join(", ")}`}
      >
        {positions.map((position, index) => (
          <motion.div
            key={position}
            className={`skill-venn-circle skill-venn-circle-${position}`}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, x: 0, y: 0, scale: 1 }
                : {
                    opacity: 1,
                    x: isOpen
                      ? position === "left"
                        ? -22
                        : position === "right"
                          ? 22
                          : 0
                      : 0,
                    y: isOpen
                      ? position === "top"
                        ? -22
                        : position === "bottom"
                          ? 22
                          : 0
                      : 0,
                    scale: isOpen ? 1.05 : 1,
                  }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : expanded ? 0.5 : 0.65,
              delay: shouldReduceMotion ? 0 : expanded ? index * 0.035 : 0.4 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {categories[index] && (
              <motion.span
                className={`skill-venn-label skill-venn-label-${position}`}
                aria-hidden={!isOpen}
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion || !isOpen ? 0 : 0.25 + index * 0.07,
                }}
              >
                {categories[index]}
              </motion.span>
            )}
          </motion.div>
        ))}
        <motion.button
          type="button"
          className="skill-venn-avatar"
          aria-label={
            isOpen
              ? "Close focus diagram"
              : "Open focus diagram around profile photo"
          }
          aria-expanded={isOpen}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, scale: 0.65, x: "-50%", y: "-50%" }
          }
          animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 20,
            delay: shouldReduceMotion ? 0 : 0.7,
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovered(true);
          }}
          onPointerDown={(event) => {
            touchPointer.current = event.pointerType === "touch";
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setHovered(false);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={(event) => {
            setFocused(false);
            if (touchPointer.current || event.detail === 0) {
              setExpanded((current) => !current);
            }
            touchPointer.current = false;
          }}
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" />
          ) : (
            initials
          )}
        </motion.button>
      </div>
    </div>
  );
}
