import { describe, expect, it } from "vitest";

import { blogCardHasRequiredFields } from "@/components/BlogCard";
import { getAllPosts } from "@/lib/content/blog";

describe("blogCardHasRequiredFields", () => {
  it("accepts complete card frontmatter", () => {
    expect(
      blogCardHasRequiredFields({
        title: "A post",
        description: "Worth reading",
        date: "2026-01-18",
      }),
    ).toBe(true);
  });

  it("rejects missing title, description, or bad date", () => {
    expect(
      blogCardHasRequiredFields({
        title: "",
        description: "Worth reading",
        date: "2026-01-18",
      }),
    ).toBe(false);
    expect(
      blogCardHasRequiredFields({
        title: "A post",
        description: "",
        date: "2026-01-18",
      }),
    ).toBe(false);
    expect(
      blogCardHasRequiredFields({
        title: "A post",
        description: "Worth reading",
        date: "01-18-2026",
      }),
    ).toBe(false);
  });
});

describe("blog card data", () => {
  it("loads fields BlogCard renders for each published post", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.slug.length).toBeGreaterThan(0);
      expect(blogCardHasRequiredFields(post.frontmatter)).toBe(true);
      expect(Array.isArray(post.frontmatter.tags)).toBe(true);
      expect(post.frontmatter.published).toBe(true);
    }
  });
});
