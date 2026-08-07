import { describe, expect, it } from "vitest";

import { generateStarField, mulberry32 } from "@/lib/starfield";

describe("mulberry32", () => {
  it("returns a deterministic sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("returns values in [0, 1)", () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 50; i += 1) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("generateStarField", () => {
  it("returns an empty array for non-positive counts", () => {
    expect(generateStarField(0)).toEqual([]);
    expect(generateStarField(-3)).toEqual([]);
  });

  it("returns the requested number of stars", () => {
    expect(generateStarField(12)).toHaveLength(12);
  });

  it("is deterministic for the same seed", () => {
    expect(generateStarField(8, 99)).toEqual(generateStarField(8, 99));
  });

  it("differs across seeds", () => {
    expect(generateStarField(8, 1)).not.toEqual(generateStarField(8, 2));
  });

  it("keeps positions and sizes in expected ranges", () => {
    const stars = generateStarField(20, 1234);
    for (const star of stars) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(100);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(100);
      expect(star.size).toBeGreaterThanOrEqual(1);
      expect(star.size).toBeLessThanOrEqual(3.25);
      expect(star.opacity).toBeGreaterThanOrEqual(0.3);
      expect(star.opacity).toBeLessThanOrEqual(1);
      expect(star.delay).toBeGreaterThanOrEqual(0);
      expect(star.delay).toBeLessThanOrEqual(5);
    }
  });
});
