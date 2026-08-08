import Link from "next/link";

import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";
import type { ProjectDocument } from "@/lib/content/projects";
import type { ProjectFrontmatter } from "@/lib/content/schemas";

export type ProjectCardVariant = "default" | "compact";

type SharedProps = {
  variant?: ProjectCardVariant;
  className?: string;
  /** Cap how many tags render (compact home strip uses fewer). */
  maxTags?: number;
};

type ProjectCardFromDocument = SharedProps & {
  project: ProjectDocument;
  slug?: never;
  frontmatter?: never;
};

type ProjectCardFromParts = SharedProps & {
  project?: never;
  slug: string;
  frontmatter: ProjectFrontmatter;
};

export type ProjectCardProps = ProjectCardFromDocument | ProjectCardFromParts;

export function projectStatusLabel(
  status: ProjectFrontmatter["status"],
): string {
  switch (status) {
    case "wip":
      return "In progress";
    case "archived":
      return "Archived";
    case "shipped":
    default:
      return "Shipped";
  }
}

function resolveProject(props: ProjectCardProps): {
  slug: string;
  frontmatter: ProjectFrontmatter;
} {
  if ("project" in props && props.project) {
    return {
      slug: props.project.slug,
      frontmatter: props.project.frontmatter,
    };
  }

  return {
    slug: props.slug,
    frontmatter: props.frontmatter,
  };
}

export function ProjectCard(props: ProjectCardProps) {
  const {
    variant = "default",
    className,
    maxTags = variant === "compact" ? 3 : undefined,
  } = props;
  const { slug, frontmatter } = resolveProject(props);
  const tags =
    maxTags === undefined
      ? frontmatter.tags
      : frontmatter.tags.slice(0, maxTags);
  const isCompact = variant === "compact";

  return (
    <TiltCard className={cn("rounded-lg", className)}>
      <Link
        href={`/projects/${slug}`}
        className={cn(
          "group block rounded-lg border border-ink/10 bg-surface-raised/60 transition-[border-color,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "hover:border-accent/35 hover:bg-surface-raised",
          isCompact ? "px-4 py-5 sm:px-5" : "px-4 py-6 sm:px-6",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3",
            isCompact &&
              "sm:flex-row sm:items-baseline sm:justify-between sm:gap-8",
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3
                className={cn(
                  "font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-accent",
                  isCompact ? "text-xl" : "text-xl sm:text-2xl",
                )}
              >
                {frontmatter.title}
              </h3>
              {frontmatter.featured ? (
                <span className="text-xs font-medium tracking-wide text-accent">
                  Featured
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-2 max-w-2xl text-ink-muted",
                isCompact ? "text-base" : "text-base sm:text-lg",
              )}
            >
              {frontmatter.description}
            </p>

            {!isCompact ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
                <time dateTime={frontmatter.date}>{frontmatter.date}</time>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                    frontmatter.status === "wip" &&
                      "bg-accent-soft text-accent",
                    frontmatter.status === "shipped" &&
                      "bg-ink/5 text-ink-muted",
                    frontmatter.status === "archived" &&
                      "bg-ink/5 text-ink-muted",
                  )}
                >
                  {projectStatusLabel(frontmatter.status)}
                </span>
              </div>
            ) : null}
          </div>

          {tags.length > 0 ? (
            <p
              className={cn(
                "text-sm text-ink-muted",
                isCompact ? "shrink-0 sm:text-right" : "mt-1",
              )}
            >
              {tags.join(" · ")}
            </p>
          ) : null}
        </div>
      </Link>
    </TiltCard>
  );
}
