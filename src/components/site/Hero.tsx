import type { Profile, Skill } from "@/lib/types";
import SkillsVenn from "./SkillsVenn";
import RevealOnLoad from "./RevealOnLoad";

export default function Hero({ profile, skills }: {
  profile: Profile;
  skills: Skill[];
}) {
  return (
    <section id="profile" className="scroll-mt-24">
      <div className="max-w-3xl">
        <RevealOnLoad>
          <h1 className="break-words text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {profile.full_name}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            {profile.role_title || "IT Support & Application Support"}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
        </RevealOnLoad>
        <RevealOnLoad delay={0.15}>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
            {profile.tagline ||
              "Dukungan yang jelas untuk pengguna dan aplikasi yang menopang operasional."}
          </p>
          {profile.bio && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
              {profile.bio}
            </p>
          )}
        </RevealOnLoad>
        <RevealOnLoad delay={0.3} duration={0.7}>
          <SkillsVenn profile={profile} skills={skills} />
        </RevealOnLoad>
      </div>
    </section>
  );
}
