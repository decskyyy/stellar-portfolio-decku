import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PublicShell from "@/components/site/PublicShell";
import Reveal from "@/components/site/Reveal";
import { GithubIcon } from "@/components/site/BrandIcon";
import { getProfile, getProject } from "@/lib/site-data";
import { profileUrl, safeExternalUrl } from "@/lib/urls";

export const revalidate = 60;

type ProjectPageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.id);

  return {
    title: project?.title ?? "Proyek tidak ditemukan",
    description: project?.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const [profile, project] = await Promise.all([
    getProfile(),
    getProject(params.id),
  ]);
  if (!project) notFound();

  const demoUrl = safeExternalUrl(project.demo_url);
  const githubUrl = profileUrl(project.github_url, "github");

  return (
    <PublicShell profile={profile}>
      <section className="container scroll-mt-24 py-12 md:py-14">
        <Reveal className="mx-auto max-w-3xl">
          <Link
            href="/projects"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>
          <p className="portfolio-section-label mt-7">Personal project</p>
          <h1 className="mt-3 break-words text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {project.title}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-ink-muted sm:text-base">
            {project.description}
          </p>

          {project.image_url && (
            <div className="mt-7 overflow-hidden rounded-xl border border-base-muted bg-base-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image_url}
                alt={`${project.title} preview`}
                className="max-h-[32rem] w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {project.tech_stack.length > 0 && (
            <div className="mt-7">
              <h2 className="portfolio-section-label">Technology</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-base-muted px-3 py-1.5 text-xs text-ink-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-base-muted pt-4">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
              >
                View demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
              >
                <GithubIcon className="h-4 w-4" />
                Source code
              </a>
            )}
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}
