import type { Metadata } from "next";
import Link from "next/link";

import { getAllProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and case write-ups.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Case write-ups loaded from MDX in the repo — no CMS in the middle.
      </p>
      {projects.length === 0 ? (
        <p className="mt-10 text-ink-muted">No projects published yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
          {projects.map((project) => (
            <li key={project.slug} className="py-6">
              <Link
                href={`/projects/${project.slug}`}
                className="group block focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                    {project.frontmatter.title}
                  </h2>
                  <time
                    dateTime={project.frontmatter.date}
                    className="text-sm text-ink-muted"
                  >
                    {project.frontmatter.date}
                  </time>
                </div>
                <p className="mt-2 max-w-2xl text-ink-muted">
                  {project.frontmatter.description}
                </p>
                {project.frontmatter.tags.length > 0 ? (
                  <p className="mt-3 text-sm text-ink-muted">
                    {project.frontmatter.tags.join(" · ")}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
