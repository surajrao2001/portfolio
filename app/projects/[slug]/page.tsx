import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx/MdxContent";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/content/projects";

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
        <Link href="/projects" className="hover:text-ink">
          Projects
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{frontmatter.title}</span>
      </p>
      <header className="mt-4 border-b border-ink/10 pb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{frontmatter.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
          <time dateTime={frontmatter.date}>{frontmatter.date}</time>
          <span className="capitalize">{frontmatter.status}</span>
          {frontmatter.tags.length > 0 ? (
            <span>{frontmatter.tags.join(" · ")}</span>
          ) : null}
        </div>
        {(frontmatter.demoUrl || frontmatter.repoUrl) && (
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            {frontmatter.demoUrl ? (
              <a
                href={frontmatter.demoUrl}
                className="font-medium text-accent underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Live demo
              </a>
            ) : null}
            {frontmatter.repoUrl ? (
              <a
                href={frontmatter.repoUrl}
                className="font-medium text-accent underline-offset-4 hover:underline"
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
