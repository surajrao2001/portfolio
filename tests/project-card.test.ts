import { describe, expect, it } from "vitest";

import { projectStatusLabel } from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/content/projects";

describe("projectStatusLabel", () => {
  it("returns readable labels for every project status", () => {
    expect(projectStatusLabel("shipped")).toBe("Shipped");
    expect(projectStatusLabel("wip")).toBe("In progress");
    expect(projectStatusLabel("archived")).toBe("Archived");
  });
});

describe("project card data", () => {
  it("loads fields ProjectCard renders for each committed project", () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThan(0);

    for (const project of projects) {
      expect(project.slug.length).toBeGreaterThan(0);
      expect(project.frontmatter.title.length).toBeGreaterThan(0);
      expect(project.frontmatter.description.length).toBeGreaterThan(0);
      expect(project.frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(project.frontmatter.tags)).toBe(true);
      expect(["shipped", "wip", "archived"]).toContain(
        project.frontmatter.status,
      );
      expect(typeof project.frontmatter.featured).toBe("boolean");
    }
  });
});
