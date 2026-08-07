import {
  loadAllMdx,
  loadMdxBySlug,
  sortByDateDesc,
  type MdxDocument,
} from "@/lib/content/load-mdx";
import {
  projectFrontmatterSchema,
  type ProjectFrontmatter,
} from "@/lib/content/schemas";

export type ProjectDocument = MdxDocument<ProjectFrontmatter>;

export function getAllProjects(): ProjectDocument[] {
  return sortByDateDesc(loadAllMdx("projects", projectFrontmatterSchema));
}

export function getFeaturedProjects(): ProjectDocument[] {
  return getAllProjects().filter((project) => project.frontmatter.featured);
}

export function getProjectBySlug(slug: string): ProjectDocument | null {
  return loadMdxBySlug("projects", slug, projectFrontmatterSchema);
}

export function getProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}
