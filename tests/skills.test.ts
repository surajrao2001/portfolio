import { describe, expect, it } from "vitest";

import { getAllSkills, skillGroups } from "@/lib/skills";

describe("skillGroups", () => {
  it("defines non-empty labeled groups", () => {
    expect(skillGroups.length).toBeGreaterThan(0);
    for (const group of skillGroups) {
      expect(group.id.length).toBeGreaterThan(0);
      expect(group.label.length).toBeGreaterThan(0);
      expect(group.skills.length).toBeGreaterThan(0);
    }
  });

  it("returns a flat skill list without empty names", () => {
    const all = getAllSkills();
    expect(all.length).toBeGreaterThanOrEqual(skillGroups.length);
    expect(all.every((skill) => skill.trim().length > 0)).toBe(true);
  });
});
