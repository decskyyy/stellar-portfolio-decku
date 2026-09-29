import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="container scroll-mt-24 py-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="portfolio-section-label">Proyek pribadi</h2>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Eksplorasi web pribadi ditampilkan terpisah dari pengalaman
          profesional, sebagai bukti inisiatif dan ketertarikan teknis.
        </p>
      </Reveal>

      {projects.length > 0 ? (
        <div className="mx-auto mt-5 max-w-3xl divide-y divide-base-muted/80">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={Math.min(index * 0.08, 0.32)} y={14}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <p className="mt-4 text-sm leading-7 text-ink-muted">
            Placeholder: tambahkan proyek web pribadi beserta kontribusi,
            teknologi, dan hasil yang dapat ditunjukkan.
          </p>
        </Reveal>
      )}
    </section>
  );
}
