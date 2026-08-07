import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { z } from "zod";

import type { ContentKind } from "@/lib/content/schemas";

const contentRoot = path.join(process.cwd(), "content");

export type MdxDocument<TFrontmatter> = {
  slug: string;
  frontmatter: TFrontmatter;
  body: string;
  filePath: string;
};

function contentDir(kind: ContentKind): string {
  return path.join(contentRoot, kind);
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/i, "");
}

export function listMdxFilenames(kind: ContentKind): string[] {
  const dir = contentDir(kind);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b));
}

export function readMdxSource(kind: ContentKind, slug: string): string {
  const filePath = path.join(contentDir(kind), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing MDX file for ${kind}/${slug} at ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

export function parseMdxDocument<TSchema extends z.ZodTypeAny>(
  kind: ContentKind,
  filename: string,
  schema: TSchema,
): MdxDocument<z.infer<TSchema>> {
  const slug = slugFromFilename(filename);
  const filePath = path.join(contentDir(kind), filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter in ${kind}/${filename}: ${details}`);
  }

  return {
    slug,
    frontmatter: parsed.data,
    body: content.trim(),
    filePath,
  };
}

export function loadAllMdx<TSchema extends z.ZodTypeAny>(
  kind: ContentKind,
  schema: TSchema,
): MdxDocument<z.infer<TSchema>>[] {
  return listMdxFilenames(kind).map((filename) =>
    parseMdxDocument(kind, filename, schema),
  );
}

export function loadMdxBySlug<TSchema extends z.ZodTypeAny>(
  kind: ContentKind,
  slug: string,
  schema: TSchema,
): MdxDocument<z.infer<TSchema>> | null {
  const filename = `${slug}.mdx`;
  const filePath = path.join(contentDir(kind), filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parseMdxDocument(kind, filename, schema);
}

/** Stable descending sort key: YYYY-MM-DD dates compare lexicographically. */
export function sortByDateDesc<T extends { frontmatter: { date: string } }>(
  docs: T[],
): T[] {
  return [...docs].sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  );
}
