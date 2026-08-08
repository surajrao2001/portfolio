import Link from "next/link";

import { cn } from "@/lib/cn";
import type { BlogDocument } from "@/lib/content/blog";
import type { BlogFrontmatter } from "@/lib/content/schemas";

export type BlogCardVariant = "default" | "compact";

type SharedProps = {
  variant?: BlogCardVariant;
  className?: string;
  /** Cap how many tags render (optional list density). */
  maxTags?: number;
};

type BlogCardFromDocument = SharedProps & {
  post: BlogDocument;
  slug?: never;
  frontmatter?: never;
};

type BlogCardFromParts = SharedProps & {
  post?: never;
  slug: string;
  frontmatter: BlogFrontmatter;
};

export type BlogCardProps = BlogCardFromDocument | BlogCardFromParts;

function resolvePost(props: BlogCardProps): {
  slug: string;
  frontmatter: BlogFrontmatter;
} {
  if ("post" in props && props.post) {
    return {
      slug: props.post.slug,
      frontmatter: props.post.frontmatter,
    };
  }

  return {
    slug: props.slug,
    frontmatter: props.frontmatter,
  };
}

/** Fields a list card must have before it is worth rendering. */
export function blogCardHasRequiredFields(
  frontmatter: Pick<BlogFrontmatter, "title" | "description" | "date">,
): boolean {
  return (
    frontmatter.title.length > 0 &&
    frontmatter.description.length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)
  );
}

export function BlogCard(props: BlogCardProps) {
  const {
    variant = "default",
    className,
    maxTags = variant === "compact" ? 3 : undefined,
  } = props;
  const { slug, frontmatter } = resolvePost(props);
  const tags =
    maxTags === undefined
      ? frontmatter.tags
      : frontmatter.tags.slice(0, maxTags);
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn(
        "group block rounded-lg bg-surface-raised/70 shadow-sm ring-1 ring-ink/5 transition-[background-color,box-shadow,ring-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "hover:bg-surface-raised hover:ring-accent/25 hover:shadow-md",
        isCompact ? "px-4 py-5 sm:px-5" : "px-4 py-6 sm:px-6",
        className,
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
          <time
            dateTime={frontmatter.date}
            className="text-sm font-medium tracking-wide text-accent"
          >
            {frontmatter.date}
          </time>

          <h2
            className={cn(
              "mt-2 font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-accent",
              isCompact ? "text-xl" : "text-xl sm:text-2xl",
            )}
          >
            {frontmatter.title}
          </h2>

          <p
            className={cn(
              "mt-2 max-w-2xl text-ink-muted",
              isCompact ? "text-base" : "text-base sm:text-lg",
            )}
          >
            {frontmatter.description}
          </p>
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
  );
}
