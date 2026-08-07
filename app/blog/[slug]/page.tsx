import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx/MdxContent";
import { getPostBySlug, getPostSlugs } from "@/lib/content/blog";
import { siteConfig } from "@/lib/site-config";

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const { frontmatter, body } = post;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm text-ink-muted">
        <Link href="/blog" className="hover:text-ink">
          Blog
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
          <span>{siteConfig.author.name}</span>
          {frontmatter.tags.length > 0 ? (
            <span>{frontmatter.tags.join(" · ")}</span>
          ) : null}
        </div>
      </header>
      <div className="pt-2">
        <MdxContent source={body} />
      </div>
    </article>
  );
}
