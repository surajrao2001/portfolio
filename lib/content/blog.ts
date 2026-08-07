import {
  loadAllMdx,
  loadMdxBySlug,
  sortByDateDesc,
  type MdxDocument,
} from "@/lib/content/load-mdx";
import {
  blogFrontmatterSchema,
  type BlogFrontmatter,
} from "@/lib/content/schemas";

export type BlogDocument = MdxDocument<BlogFrontmatter>;

export function getAllPosts(options?: { includeDrafts?: boolean }): BlogDocument[] {
  const posts = sortByDateDesc(loadAllMdx("blog", blogFrontmatterSchema));
  if (options?.includeDrafts) {
    return posts;
  }
  return posts.filter((post) => post.frontmatter.published);
}

export function getPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): BlogDocument | null {
  const post = loadMdxBySlug("blog", slug, blogFrontmatterSchema);
  if (!post) {
    return null;
  }
  if (!options?.includeDrafts && !post.frontmatter.published) {
    return null;
  }
  return post;
}

export function getPostSlugs(options?: { includeDrafts?: boolean }): string[] {
  return getAllPosts(options).map((post) => post.slug);
}
