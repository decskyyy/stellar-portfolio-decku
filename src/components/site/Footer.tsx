import type { Profile } from "@/lib/types";
import { Mail } from "lucide-react";
import { profileUrl } from "@/lib/urls";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";

export default function Footer({ profile }: { profile: Profile }) {
  const socialLinks = [
    {
      name: "GitHub",
      href: profileUrl(profile.github_url, "github"),
      icon: GithubIcon,
    },
    {
      name: "LinkedIn",
      href: profileUrl(profile.linkedin_url, "linkedin"),
      icon: LinkedinIcon,
    },
    {
      name: "Email",
      href: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
    },
  ].flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));

  return (
    <footer className="border-t border-base-muted">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-7 text-center sm:px-6 md:hidden">
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.name === "Email" ? undefined : "_blank"}
              rel={link.name === "Email" ? undefined : "noopener noreferrer"}
              className="rounded-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
              aria-label={link.name}
            >
              <link.icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-sm font-normal text-ink-muted/70">
          Made with ❤️ by Decky
        </p>
        <p className="text-xs text-ink-faint">
          &copy; 2025 Aristo Decky Susilo
        </p>
      </div>

      <div className="mx-auto hidden max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,26rem)_minmax(0,1fr)] items-center gap-4 px-6 py-6 md:grid lg:px-8">
        <div className="text-left">
          <p className="text-sm font-semibold text-ink-muted">
            Made with ❤️ by Decky
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            &copy; 2025 Aristo Decky Susilo
          </p>
        </div>
        <div aria-hidden="true" className="h-12" />
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-end gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name === "Email" ? undefined : "_blank"}
                rel={link.name === "Email" ? undefined : "noopener noreferrer"}
                className="rounded-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
