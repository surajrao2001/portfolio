import { Reveal } from "@/components/motion/Reveal";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/Button";
import type { BlogDocument } from "@/lib/content/blog";
import { cn } from "@/lib/cn";

type FeaturedPostsProps = {
  posts: BlogDocument[];
  className?: string;
};

/** Home “sometimes I write” strip — reuses BlogCard for list consistency. */
export function FeaturedPosts({ posts, className }: FeaturedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-posts-heading"
      className={cn(className)}
    >
      <Reveal>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-accent">
                Sometimes I write
              </p>
              <h2
                id="featured-posts-heading"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Blog
              </h2>
              <p className="mt-3 max-w-xl text-ink-muted">
                Notes ship with the repo — write, commit, deploy. No CMS theatre.
              </p>
            </div>
            <Button href="/blog" variant="ghost">
              All posts
            </Button>
          </div>
          <ul className="mt-10 flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
