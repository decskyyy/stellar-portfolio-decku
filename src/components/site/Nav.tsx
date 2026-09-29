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
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { profileUrl } from "@/lib/urls";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";

const links = [
  { href: "/", label: "Beranda", icon: Home, route: "home" },
  { href: "/projects", label: "Proyek", icon: Folder, route: "projects" },
  {
    href: "/experience",
    label: "Pengalaman",
    icon: Briefcase,
    route: "experience",
  },
  { href: "/skills", label: "Keahlian", icon: Code, route: "skills" },
  { href: "/contact", label: "Kontak", icon: Mail, route: "contact" },
];

const MotionLink = motion(Link);

export default function Nav({
  name,
  profile,
}: {
  name: string;
  profile: Profile;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
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
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-base-muted/70 bg-base/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="min-w-0 rounded-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            <span className="block truncate text-sm font-semibold">{name}</span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigasi utama"
            className="border-t border-base-muted/70 px-4 py-3"
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-1 sm:px-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    currentRoute === link.route ? "page" : undefined
                  }
                  className={`min-h-11 rounded-lg px-3 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft ${
                    currentRoute === link.route
                      ? "text-ink"
                      : "text-ink-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <motion.nav
        aria-label="Navigasi utama"
        className="fixed bottom-4 left-1/2 z-40 hidden items-center gap-1 rounded-2xl border border-white/10 bg-base/90 p-1.5 shadow-2xl backdrop-blur-xl md:flex"
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
        {links.map(({ href, label, icon: Icon, route }, index) => (
          <MotionLink
            key={href}
            href={href}
            aria-label={label}
            aria-current={currentRoute === route ? "page" : undefined}
            title={label}
            className={`dock-control group ${currentRoute === route ? "dock-control-active" : ""}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              delay: shouldReduceMotion ? 0 : 0.4 + index * 0.06,
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.12 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="dock-tooltip">{label}</span>
          </MotionLink>
        ))}
        {socialLinks.length > 0 && (
          <>
            <span className="dock-divider" aria-hidden="true" />
            {socialLinks.map(({ href, label, icon: Icon }, index) => (
              <MotionLink
                key={label}
                href={href ?? "/"}
                aria-label={label}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noopener noreferrer"}
                className="dock-control group"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.72 + index * 0.06,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.12 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
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
