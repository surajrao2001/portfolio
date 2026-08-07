import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building products and shipping carefully.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Posts ship as Markdown/MDX in git — write, commit, deploy.
      </p>
      {posts.length === 0 ? (
        <p className="mt-10 text-ink-muted">No posts published yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
          {posts.map((post) => (
            <li key={post.slug} className="py-6">
              <Link
                href={`/blog/${post.slug}`}
                className="group block focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold tracking-tight group-hover:text-accent">
                    {post.frontmatter.title}
                  </h2>
                  <time
                    dateTime={post.frontmatter.date}
                    className="text-sm text-ink-muted"
                  >
                    {post.frontmatter.date}
                  </time>
                </div>
                <p className="mt-2 text-ink-muted">
                  {post.frontmatter.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
