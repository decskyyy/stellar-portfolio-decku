"use client";

import type { Experience, Project, Skill } from "@/lib/types";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

const CORE_PILLARS = [
  {
    icon: MonitorCheck,
    title: "Incident & SLA Operations",
    description:
      "Rapid ticket response, incident lifecycle management, and clear escalation protocols.",
  },
  {
    icon: Layers,
    title: "Enterprise POS & ERP",
    description:
      "System integration support for multi-outlet retail, restaurant POS, and ERP workflows.",
  },
  {
    icon: Database,
    title: "Database Diagnostics",
    description:
      "SQL query investigations, transaction reconciliation, and data integrity verification.",
  },
  {
    icon: ShieldCheck,
    title: "User Training & SOPs",
    description:
      "Comprehensive documentation, non-technical user guidance, and compliance standards.",
  },
];

function formatDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function HomeShowcase({
  projects,
  experiences,
  skills,
}: {
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
}) {
  const featuredProjects = projects.slice(0, 2);
  const recentExperiences = experiences.slice(0, 2);
  const featuredSkills = skills.slice(0, 10);

  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-14">
      {/* 1. Core Competency Cards */}
      <section aria-labelledby="core-competencies-heading">
        <Reveal>
          <h2
            id="core-competencies-heading"
            className="portfolio-section-label"
          >
            Core Competencies
          </h2>
        </Reveal>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CORE_PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={0.06 * i} y={12}>
              <div className="group flex h-full flex-col justify-between rounded-xl border border-base-muted/80 bg-base-surface/60 p-4 transition-all duration-200 hover:border-accent-soft/40 hover:bg-base-surface hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent-soft group-hover:bg-accent group-hover:text-white transition-colors">
                      <pillar.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold text-ink">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-ink-muted">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2. Featured Projects */}
      {featuredProjects.length > 0 && (
        <section aria-labelledby="featured-projects-heading">
          <Reveal>
            <div className="flex items-center justify-between">
              <h2
                id="featured-projects-heading"
                className="portfolio-section-label"
              >
                Featured Projects
              </h2>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1 font-mono text-xs font-medium text-accent-soft hover:text-accent transition-colors"
              >
                View all ({projects.length})
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-3 divide-y divide-base-muted/80">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.08} y={12}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 3. Recent Experience */}
      {recentExperiences.length > 0 && (
        <section aria-labelledby="recent-experience-heading">
          <Reveal>
            <div className="flex items-center justify-between">
              <h2
                id="recent-experience-heading"
                className="portfolio-section-label"
              >
                Career Experience
              </h2>
              <Link
                href="/experience"
                className="group inline-flex items-center gap-1 font-mono text-xs font-medium text-accent-soft hover:text-accent transition-colors"
              >
                Full timeline ({experiences.length})
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-4 space-y-3">
            {recentExperiences.map((exp, index) => (
              <Reveal key={exp.id} delay={index * 0.08} y={12}>
                <div className="rounded-xl border border-base-muted/80 bg-base-surface/50 p-4 transition-colors hover:border-accent-soft/30 hover:bg-base-surface">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="text-sm font-semibold text-ink">
                      {exp.role_title} <span className="font-normal text-ink-muted">at</span> {exp.company}
                    </h3>
                    <span className="font-mono text-xs text-ink-faint">
                      {formatDate(exp.start_date)} &ndash;{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink-muted">
                      {exp.description}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 4. Top Skills Snapshot */}
      {featuredSkills.length > 0 && (
        <section aria-labelledby="skills-snapshot-heading">
          <Reveal>
            <div className="flex items-center justify-between">
              <h2
                id="skills-snapshot-heading"
                className="portfolio-section-label"
              >
                Key Skills & Tools
              </h2>
              <Link
                href="/skills"
                className="group inline-flex items-center gap-1 font-mono text-xs font-medium text-accent-soft hover:text-accent transition-colors"
              >
                All skills
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-3 flex flex-wrap gap-2">
              {featuredSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-base-muted bg-base-surface/70 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent-soft/40 hover:text-accent-soft"
                >
                  <CheckCircle2 className="h-3 w-3 text-accent-soft" aria-hidden="true" />
                  {skill.name}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
