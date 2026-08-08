import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/Button";
import type { ProjectDocument } from "@/lib/content/projects";
import { cn } from "@/lib/cn";

type FeaturedProjectsProps = {
  projects: ProjectDocument[];
  className?: string;
};

/** Home featured strip — reuses ProjectCard (compact) for consistency with /projects. */
export function FeaturedProjects({
  projects,
  className,
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className={cn(className)}
    >
      <Reveal>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-accent">
                Selected work
              </p>
              <h2
                id="featured-projects-heading"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Featured projects
              </h2>
              <p className="mt-3 max-w-xl text-ink-muted">
                Trade-offs and constraints first — the interesting engineering
                is usually in the middle.
              </p>
            </div>
            <Button href="/projects" variant="ghost">
              All projects
            </Button>
          </div>
          <ul className="mt-10 flex flex-col gap-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
