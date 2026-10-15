"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Code,
  Folder,
  Home,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { profileUrl } from "@/lib/urls";
import { portfolioSpring } from "@/lib/motion";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";

const links = [
  { href: "/", label: "Home", icon: Home, route: "home" },
  { href: "/projects", label: "Projects", icon: Folder, route: "projects" },
  {
    href: "/experience",
    label: "Experience",
    icon: Briefcase,
    route: "experience",
  },
  { href: "/skills", label: "Skills", icon: Code, route: "skills" },
  { href: "/contact", label: "Contact", icon: Mail, route: "contact" },
];

const MotionLink = motion.create(Link);
const dockSpring = { type: "spring" as const, stiffness: 420, damping: 30, mass: 0.45 };
const quickMenuExit = { duration: 0.16, ease: "easeOut" as const };

export default function Nav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);
  const currentRoute = pathname.startsWith("/projects/")
    ? "projects"
    : links.find((link) => link.href === pathname)?.route;
  const socialLinks: Array<{
    href: string;
    label: string;
    icon: typeof GithubIcon;
  }> = [
    { href: profileUrl(profile.github_url, "github") ?? "", label: "GitHub", icon: GithubIcon },
    { href: profileUrl(profile.linkedin_url, "linkedin") ?? "", label: "LinkedIn", icon: LinkedinIcon },
  ].filter((item) => item.href);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) firstMobileLink.current?.focus();
  }, [mobileOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    mobileTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMobileMenu, mobileOpen]);

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="mobile-bubble-backdrop fixed inset-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: quickMenuExit }}
              transition={shouldReduceMotion ? { duration: 0 } : portfolioSpring}
              onClick={closeMobileMenu}
            />
            <motion.nav
              id="mobile-navigation"
              aria-label="Main navigation"
              className="mobile-bubble-nav fixed bottom-[5.25rem] right-4 z-50 flex flex-col-reverse gap-2 md:hidden"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: quickMenuExit }}
              transition={shouldReduceMotion ? { duration: 0 } : portfolioSpring}
            >
              {links.map(({ href, label, icon: Icon, route }, index) => (
                <MotionLink
                  key={href}
                  ref={index === 0 ? firstMobileLink : undefined}
                  href={href}
                  aria-current={currentRoute === route ? "page" : undefined}
                  className={`mobile-bubble-link ${
                    currentRoute === route ? "mobile-bubble-link-active" : ""
                  }`}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.8 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: 8,
                          scale: 0.86,
                          transition: quickMenuExit,
                        }
                  }
                  transition={{
                    ...(shouldReduceMotion ? { duration: 0 } : portfolioSpring),
                    delay: shouldReduceMotion ? 0 : index * 0.035,
                  }}
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 0.95, transition: portfolioSpring }
                  }
                  onClick={closeMobileMenu}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </MotionLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <button
        ref={mobileTrigger}
        type="button"
        className="mobile-bubble-trigger fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:hidden"
        onClick={() => {
          if (mobileOpen) {
            closeMobileMenu();
          } else {
            setMobileOpen(true);
          }
        }}
        aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
      >
        <motion.span
          className="grid place-items-center"
          animate={{ rotate: mobileOpen ? 90 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : portfolioSpring}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </motion.span>
      </button>

      <motion.nav
        aria-label="Main navigation"
        className="portfolio-navigation fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-canvas/90 p-1.5 shadow-2xl backdrop-blur-xl md:flex"
        initial={{ opacity: 0, y: 18, scale: 0.96, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        transition={{
          ...(shouldReduceMotion ? { duration: 0 } : dockSpring),
        }}
      >
        {links.map(({ href, label, icon: Icon, route }) => (
          <MotionLink
            key={href}
            href={href}
            tabIndex={0}
            aria-label={label}
            aria-current={currentRoute === route ? "page" : undefined}
            title={label}
            className={`dock-control group ${currentRoute === route ? "dock-control-active" : ""}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="dock-tooltip">{label}</span>
          </MotionLink>
        ))}
        {socialLinks.length > 0 && (
          <>
            <span className="dock-divider" aria-hidden="true" />
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <MotionLink
                key={label}
                href={href}
                tabIndex={0}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="dock-control group"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="dock-tooltip">{label}</span>
              </MotionLink>
            ))}
          </>
        )}
      </motion.nav>
    </>
  );
}
