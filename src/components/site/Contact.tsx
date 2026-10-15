"use client";

import type { Profile } from "@/lib/types";
import { profileUrl, safeExternalUrl } from "@/lib/urls";
import { MessageCircle, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcon";
import Reveal from "./Reveal";
import DetailModal from "./DetailModal";
import { useCallback, useState } from "react";

function whatsappUrl(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function resumeDownloadUrl(url: string) {
  const downloadUrl = new URL(url);
  downloadUrl.searchParams.set("download", "Decky-Susilo-CV.pdf");
  return downloadUrl.toString();
}

export default function Contact({ profile }: { profile: Profile }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const cvUrl = safeExternalUrl(profile.cv_url);
  const linkedinUrl = profileUrl(profile.linkedin_url, "linkedin");
  const githubUrl = profileUrl(profile.github_url, "github");
  const messageUrl = whatsappUrl(profile.phone);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  return (
    <section id="contact" className="container scroll-mt-24 py-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Contact</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
          Feel free to use the contact details below to get in touch.
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
              Contact email is not available.
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
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              View resume (PDF)
            </button>
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
      {cvUrl && (
        <DetailModal
          open={resumeOpen}
          onClose={closeResume}
          title="Resume"
          eyebrow="PDF preview"
        >
          <div className="mb-3 flex justify-end">
            <a
              href={resumeDownloadUrl(cvUrl)}
              className="inline-flex min-h-10 items-center rounded-lg border border-base-muted px-3 text-sm font-medium text-ink transition-colors hover:bg-base-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              Download resume
            </a>
          </div>
          <iframe
            src={cvUrl}
            title="Decky Susilo resume PDF"
            tabIndex={-1}
            className="h-[55vh] min-h-[320px] w-full rounded-lg border border-base-muted bg-white"
          />
        </DetailModal>
      )}
    </section>
  );
}
