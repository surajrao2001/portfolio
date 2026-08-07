import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date as YYYY-MM-DD");

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateString,
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["shipped", "wip", "archived"]).default("shipped"),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  coverImage: z.string().optional(),
});

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateString,
  tags: z.array(z.string().min(1)).default([]),
  published: z.boolean().default(true),
  coverImage: z.string().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export type ContentKind = "projects" | "blog";
