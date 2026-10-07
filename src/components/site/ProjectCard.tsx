"use client";

import type { Project } from "@/lib/types";
import { profileUrl, safeExternalUrl } from "@/lib/urls";
import { ArrowUpRight, Box } from "lucide-react";
import { GithubIcon } from "./BrandIcon";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  const demoUrl = safeExternalUrl(project.demo_url);
  const githubUrl = profileUrl(project.github_url, "github");

  return (
    <article className="group flex min-w-0 items-start gap-4 py-5">
      {project.image_url ? (
        <Link
          href={`/projects/${project.id}`}
          aria-label={`Open ${project.title} project`}
          className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-base-muted bg-base-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
        </Link>
      ) : (
        <Link
          href={`/projects/${project.id}`}
          aria-label={`Open ${project.title} project`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-base-surface text-ink-faint transition-colors duration-200 group-hover:bg-base-muted group-hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
        >
          <Box className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        </Link>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="break-words text-base font-semibold text-ink transition-colors group-hover:text-accent-soft">
          <Link
            href={`/projects/${project.id}`}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            {project.title}
          </Link>
        </h3>
        <Link
          href={`/projects/${project.id}`}
          className="mt-1 break-words text-sm leading-6 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
        >
          {project.description}
        </Link>
        {project.tech_stack?.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="max-w-full break-words text-xs text-ink-faint"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex min-h-10 items-center text-xs font-medium text-accent-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            View project
          </Link>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              Demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
            >
              <GithubIcon className="h-4 w-4" /> Source
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
