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
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { profileUrl } from "@/lib/urls";
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

const MotionLink = motion(Link);

export default function Nav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteTheme, setSiteTheme] = useState<"dark" | "light">("dark");
  const shouldReduceMotion = useReducedMotion();
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);
  const currentRoute = pathname.startsWith("/projects/")
    ? "projects"
    : links.find((link) => link.href === pathname)?.route;
  const socialLinks = [
    {
      href: profileUrl(profile.github_url, "github"),
      label: "GitHub",
      icon: GithubIcon,
    },
    {
      href: profileUrl(profile.linkedin_url, "linkedin"),
      label: "LinkedIn",
      icon: LinkedinIcon,
    },
    {
      href: profile.email ? `mailto:${profile.email}` : null,
      label: "Email",
      icon: Mail,
    },
  ].filter((item) => item.href);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setSiteTheme(
      document.documentElement.dataset.siteTheme === "light" ? "light" : "dark",
    );
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (themeColor) {
      themeColor.content =
        document.documentElement.dataset.siteTheme === "light"
          ? "#eff1f3"
          : "#121212";
    }
  }, []);

  useEffect(() => {
    if (mobileOpen) firstMobileLink.current?.focus();
  }, [mobileOpen]);

  const themeTransitionTimeout = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (themeTransitionTimeout.current !== undefined) {
        window.clearTimeout(themeTransitionTimeout.current);
      }
      document.documentElement.classList.remove("theme-transitioning");
    },
    [],
  );

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    mobileTrigger.current?.focus();
  }, []);

  const toggleSiteTheme = () => {
    const nextTheme = siteTheme === "dark" ? "light" : "dark";
    if (themeTransitionTimeout.current !== undefined) {
      window.clearTimeout(themeTransitionTimeout.current);
    }
    if (!shouldReduceMotion) {
      document.documentElement.classList.add("theme-transitioning");
      themeTransitionTimeout.current = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
        themeTransitionTimeout.current = undefined;
      }, 480);
    }
    document.documentElement.dataset.siteTheme = nextTheme;
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (themeColor) themeColor.content = nextTheme === "light" ? "#eff1f3" : "#121212";
    try {
      window.localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Could not save the portfolio theme preference.", error);
    }
    setSiteTheme(nextTheme);
  };

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
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              onClick={closeMobileMenu}
            />
            <motion.nav
              id="mobile-navigation"
              aria-label="Main navigation"
              className="mobile-bubble-nav fixed bottom-[5.25rem] right-4 z-50 flex flex-col-reverse gap-2 md:hidden"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                      : { opacity: 0, y: 8, scale: 0.86 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.2,
                    delay: shouldReduceMotion ? 0 : index * 0.035,
                  }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                  onClick={closeMobileMenu}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </MotionLink>
              ))}
              <motion.button
                type="button"
                className="mobile-bubble-link"
                onClick={toggleSiteTheme}
                aria-pressed={siteTheme === "light"}
                aria-label={`Switch to ${siteTheme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${siteTheme === "dark" ? "light" : "dark"} mode`}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.8 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8, scale: 0.86 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  delay: shouldReduceMotion ? 0 : links.length * 0.035,
                }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              >
                {siteTheme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{siteTheme === "dark" ? "Light mode" : "Dark mode"}</span>
              </motion.button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <button
        ref={mobileTrigger}
        type="button"
        className="mobile-bubble-trigger fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-base md:hidden"
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
          transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </motion.span>
      </button>

      <motion.nav
        aria-label="Main navigation"
        className="portfolio-navigation fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-base/90 p-1.5 shadow-2xl backdrop-blur-xl md:flex"
        initial={
          shouldReduceMotion
            ? false
            : { opacity: 0, y: 18, scale: 0.96, x: "-50%" }
        }
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.45,
          delay: shouldReduceMotion ? 0 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {links.map(({ href, label, icon: Icon, route }) => (
          <MotionLink
            key={href}
            href={href}
            aria-label={label}
            aria-current={currentRoute === route ? "page" : undefined}
            title={label}
            className={`dock-control group ${currentRoute === route ? "dock-control-active" : ""}`}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -2,
                    scale: 1.04,
                    transition: { type: "spring", stiffness: 520, damping: 30 },
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.97,
                    transition: { type: "spring", stiffness: 650, damping: 32 },
                  }
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="dock-tooltip">{label}</span>
          </MotionLink>
        ))}
        <motion.button
          type="button"
          className="dock-control group"
          onClick={toggleSiteTheme}
          aria-pressed={siteTheme === "light"}
          aria-label={`Switch to ${siteTheme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${siteTheme === "dark" ? "light" : "dark"} mode`}
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  y: -2,
                  scale: 1.04,
                  transition: { type: "spring", stiffness: 520, damping: 30 },
                }
          }
          whileTap={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 0.97,
                  transition: { type: "spring", stiffness: 650, damping: 32 },
                }
          }
        >
          {siteTheme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="dock-tooltip">
            {siteTheme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </motion.button>
        {socialLinks.length > 0 && (
          <>
            <span className="dock-divider" aria-hidden="true" />
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <MotionLink
                key={label}
                href={href ?? "/"}
                aria-label={label}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noopener noreferrer"}
                className="dock-control group"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -2,
                        scale: 1.04,
                        transition: { type: "spring", stiffness: 520, damping: 30 },
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 0.97,
                        transition: { type: "spring", stiffness: 650, damping: 32 },
                      }
                }
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
