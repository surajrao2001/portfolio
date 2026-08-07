import Link from "next/link";

import { Button } from "@/components/ui/Button";
import type { ProjectDocument } from "@/lib/content/projects";
import { cn } from "@/lib/cn";

type FeaturedProjectsProps = {
  projects: ProjectDocument[];
  className?: string;
};

/** Home featured strip — list presentation only; ProjectCard lives in a later milestone. */
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
          </div>
          <Button href="/projects" variant="ghost">
            All projects
          </Button>
        </div>
        <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-2 py-6 transition-colors focus-visible:outline-offset-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent">
                    {project.frontmatter.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-ink-muted">
                    {project.frontmatter.description}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-ink-muted">
                  {project.frontmatter.tags.slice(0, 3).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
