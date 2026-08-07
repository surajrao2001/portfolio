import { describe, expect, it } from "vitest";

import {
  blogFrontmatterSchema,
  projectFrontmatterSchema,
} from "@/lib/content/schemas";

describe("projectFrontmatterSchema", () => {
  it("accepts a valid project document", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "RAGscope",
      description: "A retrieval workbench.",
      date: "2025-11-12",
      tags: ["rag"],
      featured: true,
      status: "shipped",
      repoUrl: "https://github.com/example/ragscope",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(true);
      expect(result.data.status).toBe("shipped");
    }
  });

  it("applies defaults for optional presentation fields", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "Minimal",
      description: "Bare frontmatter.",
      date: "2026-01-01",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
      expect(result.data.featured).toBe(false);
      expect(result.data.status).toBe("shipped");
    }
  });

  it("rejects malformed dates", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "Bad date",
      description: "Nope",
      date: "12/01/2026",
    });
    expect(result.success).toBe(false);
  });
});

describe("blogFrontmatterSchema", () => {
  it("defaults published to true", () => {
    const result = blogFrontmatterSchema.safeParse({
      title: "Post",
      description: "Notes",
      date: "2026-01-18",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(true);
    }
  });

  it("rejects empty titles", () => {
    const result = blogFrontmatterSchema.safeParse({
      title: "",
      description: "Notes",
      date: "2026-01-18",
    });
    expect(result.success).toBe(false);
  });
});
