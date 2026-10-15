"use client";

import type { Profile } from "@/lib/types";
import SkillsVenn from "./SkillsVenn";
import RevealOnLoad from "./RevealOnLoad";

export default function Hero({ profile }: { profile: Profile }) {
  const tagline = profile.tagline?.trim();

  return (
    <section id="profile" className="home-hero scroll-mt-24">
      <div className="home-hero-layout">
        <div className="home-hero-copy">
          <RevealOnLoad>
            <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {profile.full_name}
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {profile.role_title || "IT Support & Application Support"}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </RevealOnLoad>

          <RevealOnLoad delay={0.15}>
            {tagline && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
                {tagline}
              </p>
            )}
          </RevealOnLoad>
        </div>

        <RevealOnLoad delay={0.3} className="home-hero-visual">
          <SkillsVenn profile={profile} />
        </RevealOnLoad>
      </div>
    </section>
  );
}
