import type { Profile } from "@/lib/types";
import { profileUrl } from "@/lib/urls";
import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";

export default function About({ profile }: { profile: Profile }) {
  const contactDetails = [
    {
      label: "Lokasi",
      value: profile.location,
      icon: MapPin,
    },
    {
      label: "Email",
      value: profile.email,
      href: profile.email ? `mailto:${profile.email}` : undefined,
      icon: Mail,
    },
    {
      label: "Telepon",
      value: profile.phone,
      href: profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, "")}` : undefined,
      icon: Phone,
    },
  ].filter((item) => item.value);

  const socialLinks = [
    {
      name: "LinkedIn",
      href: profileUrl(profile.linkedin_url, "linkedin"),
      icon: LinkedinIcon,
    },
    {
      name: "GitHub",
      href: profileUrl(profile.github_url, "github"),
      icon: GithubIcon,
    },
  ];

  return (
    <section id="profile" className="container scroll-mt-24 py-12 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Tentang saya</h2>
        <p className="mt-4 text-base leading-7 text-ink-muted sm:text-lg">
          {profile.bio ||
            "Placeholder: tambahkan ringkasan pengalaman, tanggung jawab, dan sistem yang pernah ditangani."}
        </p>

        {contactDetails.length > 0 && (
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-base-muted pt-5 sm:grid-cols-2">
            {contactDetails.map((item) => (
              <div key={item.label} className="flex min-w-0 items-start gap-3">
                <item.icon
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-faint"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{item.label}</dt>
                  <dd className="mt-1 break-words text-sm text-ink-muted">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="rounded-sm underline decoration-white/30 underline-offset-4 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        {socialLinks.some((link) => link.href) && (
          <ul className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map(
              (link) =>
                link.href && (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ),
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
