import type { Profile } from "@/lib/types";
import { profileUrl, safeExternalUrl } from "@/lib/urls";
import { MessageCircle, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";
import Reveal from "./Reveal";

function whatsappUrl(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export default function Contact({ profile }: { profile: Profile }) {
  const cvUrl = safeExternalUrl(profile.cv_url);
  const linkedinUrl = profileUrl(profile.linkedin_url, "linkedin");
  const githubUrl = profileUrl(profile.github_url, "github");
  const messageUrl = whatsappUrl(profile.phone);

  return (
    <section id="contact" className="container scroll-mt-24 py-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Kontak</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
          Untuk peluang IT Support atau Application Support, silakan hubungi
          saya melalui detail berikut.
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-ink underline decoration-accent/70 underline-offset-4 transition-colors hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {profile.email}
            </a>
          ) : (
            <p className="min-h-11 py-3 text-sm text-ink-muted">
              Placeholder: tambahkan email kontak.
            </p>
          )}
          {messageUrl && (
            <a
              href={messageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              Resume (PDF)
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>

        {(linkedinUrl || githubUrl) && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-base-muted pt-3">
            {linkedinUrl && (
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            {githubUrl && (
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
