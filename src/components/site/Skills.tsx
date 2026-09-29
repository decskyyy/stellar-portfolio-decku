"use client";

import type { Skill } from "@/lib/types";
import {
  Database,
  ShieldCheck,
  Cog,
  Server,
  TerminalSquare,
  Code,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const categoryIcons: Record<string, LucideIcon> = {
  "Sistem & Jaringan": Server,
  "Database & SQL": Database,
  "Dukungan Teknis & Operasional": Cog,
  "Keamanan & Kepatuhan": ShieldCheck,
  Lainnya: TerminalSquare,
  default: Code,
};

function getCategoryIcon(category: string): LucideIcon {
  const normalizedCategory = category.toLowerCase();
  for (const key in categoryIcons) {
    if (normalizedCategory.includes(key.split(" & ")[0].toLowerCase())) {
      return categoryIcons[key];
    }
  }
  const foundKey = Object.keys(categoryIcons).find((key) =>
    normalizedCategory.includes(key.toLowerCase()),
  );
  return foundKey ? categoryIcons[foundKey] : categoryIcons.default;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const groups = new Map<string, Skill[]>();
  for (const s of skills) {
    const key = s.category?.trim() || "Lainnya";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  const categories = Array.from(groups.entries());

  return (
    <section className="container scroll-mt-24 py-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Keahlian</h2>
        {skills.length === 0 && (
          <p className="mt-4 text-sm leading-7 text-ink-muted">
            Placeholder: cantumkan keahlian yang relevan dengan dukungan pengguna,
            aplikasi, sistem, dan perangkat yang benar-benar pernah digunakan.
          </p>
        )}
      </Reveal>

      <div className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map(([category, list], index) => {
          const Icon = getCategoryIcon(category);
          return (
            <Reveal key={category} delay={index * 0.07} y={12}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                <h3 className="break-words text-sm font-medium text-ink">
                  {category}
                </h3>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {list.map((skill) => {
                  return (
                    <li
                      key={skill.id}
                      className="inline-flex max-w-full items-center gap-1.5 py-1 text-sm text-ink-muted"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent-soft/70" aria-hidden="true" />
                      <span className="break-words">{skill.name}</span>
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
