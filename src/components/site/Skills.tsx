"use client";

import type { Skill } from "@/lib/types";
import {
  BookOpen,
  Briefcase,
  Code2,
  Cloud,
  Database,
  Laptop,
  Monitor,
  Server,
  ShieldCheck,
  ShoppingCart,
  Cog,
  Terminal,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getPublicSkillCategory,
  getPublicSkillName,
} from "@/lib/skill-category";
import Reveal from "./Reveal";
import SkillLogo from "./SkillLogo";

const categoryIcons: Record<string, LucideIcon> = {
  "sistem & jaringan": Server,
  "operating systems": Monitor,
  "business applications & enterprise systems": Briefcase,
  "core tools & enterprise systems": Wrench,
  "support operations": Cog,
  "data & database": Database,
  "web technologies": Code2,
  "governance & security": ShieldCheck,
  "productivity & collaboration": Cloud,
  "lainnya": Laptop,
};

const skillIcons: Array<{ matches: RegExp; icon: LucideIcon }> = [
  { matches: /\b(sap|erp)\b/i, icon: Briefcase },
  { matches: /\b(postgresql|postgres|mysql|sql|pgadmin|dbeaver|database)\b/i, icon: Database },
  { matches: /\b(windows|macos)\b/i, icon: Monitor },
  { matches: /\blinux\b/i, icon: Terminal },
  { matches: /\b(html|css|javascript|typescript|react|next\.?js)\b/i, icon: Code2 },
  { matches: /\bgoogle workspace\b/i, icon: Cloud },
  { matches: /\b(hris|crm)\b/i, icon: Users },
  { matches: /\bpos\b/i, icon: ShoppingCart },
  { matches: /\b(incident|ticket|freescout|sla)\b/i, icon: Ticket },
  { matches: /\b(training|documentation|dokumentasi)\b/i, icon: BookOpen },
  { matches: /\b(iso|security|governance|compliance)\b/i, icon: ShieldCheck },
  { matches: /\b(troubleshooting|support)\b/i, icon: Wrench },
];

function getCategoryIcon(category: string): LucideIcon {
  const normalizedCategory = category.toLowerCase();
  return (
    categoryIcons[normalizedCategory] ??
    (normalizedCategory.includes("database")
      ? Database
      : normalizedCategory.includes("support")
        ? Cog
        : normalizedCategory.includes("security") ||
            normalizedCategory.includes("governance")
          ? ShieldCheck
          : Laptop)
  );
}

function getSkillIcon(name: string): LucideIcon {
  return skillIcons.find(({ matches }) => matches.test(name))?.icon ?? Wrench;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const category = getPublicSkillCategory(skill);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(skill);
  }
  const categories = Array.from(groups.entries());

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

      <div className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map(([category, list], index) => {
          const CategoryIcon = getCategoryIcon(category);
          return (
            <Reveal key={category} delay={index * 0.07} y={12}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  <h3 className="break-words text-sm font-medium text-ink">
                    {category}
                  </h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {list.map((skill) => {
                    const SkillIcon = getSkillIcon(skill.name);
                    return (
                      <li
                        key={skill.id}
                        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-base-muted/70 bg-canvas/60 px-2.5 py-1.5 text-sm text-ink-muted"
                      >
                        <SkillLogo
                          name={skill.name}
                          fallback={SkillIcon}
                          className="h-4 w-4 shrink-0 text-accent-soft"
                        />
                        <span className="break-words">
                          {getPublicSkillName(skill.name)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
