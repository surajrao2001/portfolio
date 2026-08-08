import type { Metadata } from "next";

import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { getAllPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes that ship with the repo — write, commit, deploy. Git is the CMS.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal as="header" className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-accent">
          Writing
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Posts ship as MDX in the repo — write, commit, deploy. No CMS
          dashboard; Git is the publish button.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-ink/15 bg-surface-raised/40 px-5 py-10 text-ink-muted">
          No posts published yet. Next note lands with the next commit.
        </p>
      ) : (
        <ul className="mt-12 flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
