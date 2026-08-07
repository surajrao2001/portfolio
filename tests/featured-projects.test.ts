import { describe, expect, it } from "vitest";

import { getFeaturedProjects } from "@/lib/content/projects";

describe("getFeaturedProjects", () => {
  it("returns only featured projects for the home strip", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((project) => project.frontmatter.featured)).toBe(
      true,
    );
  });
});
