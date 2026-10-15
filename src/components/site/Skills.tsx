"use client";

import type { Skill } from "@/lib/types";
import { getPublicSkillName } from "@/lib/skill-category";
import Reveal from "./Reveal";
import SkillLogo from "./SkillLogo";

export default function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section className="container scroll-mt-24 py-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Skills</h2>
        {skills.length === 0 && (
          <p className="mt-4 text-sm leading-7 text-ink-muted">
            No skills have been added yet.
          </p>
        )}
      </Reveal>

      {skills.length > 0 && (
        <Reveal className="mx-auto mt-6 max-w-3xl" y={12}>
          <ul className="flex flex-wrap gap-2.5" aria-label="Skills">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="inline-flex max-w-full items-center gap-2 rounded-md border border-base-muted/70 px-3 py-2 text-sm text-ink-muted"
              >
                <SkillLogo
                  name={skill.name}
                  className="h-4 w-4 shrink-0 text-accent-soft"
                />
                <span className="break-words">
                  {getPublicSkillName(skill.name)}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </section>
  );
}
