export type Star = {
  /** Horizontal position as percent of viewport width (0–100). */
  x: number;
  /** Vertical position as percent of viewport height (0–100). */
  y: number;
  /** Diameter in pixels. */
  size: number;
  /** Base opacity 0–1. */
  opacity: number;
  /** CSS animation-delay in seconds. */
  delay: number;
};

/** Deterministic PRNG (Mulberry32) so SSR and client produce identical stars. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULT_SEED = 0x5f3759df;

/**
 * Builds a fixed star field from a seed. Same inputs always yield the same stars.
 */
export function generateStarField(
  count: number,
  seed: number = DEFAULT_SEED,
): Star[] {
  if (count <= 0) return [];

  const rand = mulberry32(seed);
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 1 + rand() * 2.25,
      opacity: 0.3 + rand() * 0.7,
      delay: rand() * 5,
    });
  }

  return stars;
}
