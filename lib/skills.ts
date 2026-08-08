export type SkillGroup = {
  id: string;
  label: string;
  skills: readonly string[];
};

/**
 * Editable skill inventory for the home Skills section.
 * Prefer tools actually used on this site and related work — not a buzzword soup.
 */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: "stack",
    label: "Core stack",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
    ],
  },
  {
    id: "interfaces",
    label: "Interfaces",
    skills: [
      "Framer Motion",
      "Accessible UI",
      "Responsive layout",
      "Design systems",
      "MDX content",
    ],
  },
  {
    id: "craft",
    label: "Engineering craft",
    skills: [
      "System design judgment",
      "Performance basics",
      "Testing (Vitest)",
      "Git workflows",
      "API design",
    ],
  },
] as const;

export function getAllSkills(): string[] {
  return skillGroups.flatMap((group) => [...group.skills]);
}
