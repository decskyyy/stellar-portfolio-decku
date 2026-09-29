import type { Profile } from "@/lib/types";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";

export default function Footer({ profile }: { profile: Profile }) {
  const socialLinks = [
    {
      name: "GitHub",
      href: profile.github_url,
      icon: GithubIcon,
    },
    {
      name: "LinkedIn",
      href: profile.linkedin_url,
      icon: LinkedinIcon,
    },
    {
      name: "Mail",
      href: profile.email ? `mailto:${profile.email}` : undefined,
      icon: Mail,
    },
  ].flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));

  return (
    <footer className="border-t border-base-muted">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 px-4 py-7 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-ink">{profile.full_name}</p>
          <p className="mt-1 text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
