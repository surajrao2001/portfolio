import { describe, expect, it } from "vitest";

import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { sortByDateDesc } from "@/lib/content/load-mdx";

describe("project content loader", () => {
  it("loads committed project MDX files", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(2);
    expect(projects.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["ragscope", "my-ui-library"]),
    );
  });

  it("returns a project by slug with body content", () => {
    const project = getProjectBySlug("ragscope");
    expect(project).not.toBeNull();
    expect(project?.frontmatter.title).toBe("RAGscope");
    expect(project?.body.length).toBeGreaterThan(0);
  });
});

describe("blog content loader", () => {
  it("loads published posts only by default", () => {
    const posts = getAllPosts();
    expect(posts.every((post) => post.frontmatter.published)).toBe(true);
    expect(posts.map((p) => p.slug)).toContain("shipping-a-portfolio");
  });

  it("returns a post by slug", () => {
    const post = getPostBySlug("shipping-a-portfolio");
    expect(post?.frontmatter.title).toMatch(/portfolio/i);
  });
});

describe("sortByDateDesc", () => {
  it("orders documents newest first", () => {
    const sorted = sortByDateDesc([
      { frontmatter: { date: "2024-01-01" } },
      { frontmatter: { date: "2026-01-18" } },
      { frontmatter: { date: "2025-06-01" } },
    ]);
    expect(sorted.map((item) => item.frontmatter.date)).toEqual([
      "2026-01-18",
      "2025-06-01",
      "2024-01-01",
    ]);
  });
});
