import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projectStatusLabel } from "@/components/ProjectCard";
import { MdxContent } from "@/components/mdx/MdxContent";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/content/projects";
import { cn } from "@/lib/cn";

type ProjectPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const { frontmatter, body } = project;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-ink-muted">
        <Link
          href="/projects"
          className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-offset-4"
        >
          Projects
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{frontmatter.title}</span>
      </p>
      <header className="mt-4 border-b border-ink/10 pb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {frontmatter.title}
          </h1>
          {frontmatter.featured ? (
            <span className="text-xs font-medium tracking-wide text-accent">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          {frontmatter.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
          <time dateTime={frontmatter.date}>{frontmatter.date}</time>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              frontmatter.status === "wip" && "bg-accent-soft text-accent",
              frontmatter.status === "shipped" && "bg-ink/5 text-ink-muted",
              frontmatter.status === "archived" && "bg-ink/5 text-ink-muted",
            )}
          >
            {projectStatusLabel(frontmatter.status)}
          </span>
        </div>
        {frontmatter.tags.length > 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            {frontmatter.tags.join(" · ")}
          </p>
        ) : null}
        {(frontmatter.demoUrl || frontmatter.repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {frontmatter.demoUrl ? (
              <a
                href={frontmatter.demoUrl}
                className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                Live demo
              </a>
            ) : null}
            {frontmatter.repoUrl ? (
              <a
                href={frontmatter.repoUrl}
                className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                Source
              </a>
            ) : null}
          </div>
        )}
      </header>
      <div className="pt-2">
        <MdxContent source={body} />
      </div>
    </article>
  );
}
