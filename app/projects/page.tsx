import type { Metadata } from "next";

import { ProjectCard } from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "What I built, why the trade-offs, and what I'd do differently — case write-ups from MDX in the repo.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-accent">
          Case write-ups
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          What I built, why the trade-offs, what I&apos;d do differently next
          time — not a feature dump. Loaded from MDX in the repo; Git is the
          CMS.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-ink/15 bg-surface-raised/40 px-5 py-10 text-ink-muted">
          No projects published yet. Check back after the next commit lands.
        </p>
      ) : (
        <ul className="mt-12 flex flex-col gap-4">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
