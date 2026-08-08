/**
 * Pure helpers for restrained portfolio motion (tilt, magnetic, gates).
 * Client components own Framer Motion; this file stays unit-testable in Node.
 */

/** Default max tilt degrees from center — tasteful, not gimmicky. */
export const DEFAULT_TILT_MAX_DEG = 5;

/** Default magnetic pull radius in px from control center. */
export const DEFAULT_MAGNETIC_RADIUS = 72;

/** Strength of magnetic offset as a fraction of delta-to-cursor (0–1). */
export const DEFAULT_MAGNETIC_STRENGTH = 0.22;

/** Max magnetic translation in px (hard cap). */
export const DEFAULT_MAGNETIC_MAX_PX = 10;

/**
 * Pointer-driven effects (tilt, magnetic) require fine pointer and no reduced motion.
 * Same gate shape as the custom cursor; kept shared for consistency.
 */
export function shouldEnablePointerMotion(
  pointerFine: boolean,
  reducedMotion: boolean,
): boolean {
  return pointerFine && !reducedMotion;
}

/** True when section reveals / route fades should animate. */
export function shouldAnimateMotion(reducedMotion: boolean): boolean {
  return !reducedMotion;
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Map a normalized pointer offset in [-0.5, 0.5] (x,y from element center)
 * to rotateX / rotateY degrees. Y drag tilts on X; X drag tilts on Y.
 * Rotation is capped to ±maxDeg.
 */
export function tiltAnglesFromOffset(
  offsetX: number,
  offsetY: number,
  maxDeg: number = DEFAULT_TILT_MAX_DEG,
): { rotateX: number; rotateY: number } {
  const nx = clamp(offsetX, -0.5, 0.5);
  const ny = clamp(offsetY, -0.5, 0.5);
  const rotateX = clamp(-ny * 2 * maxDeg, -maxDeg, maxDeg);
  const rotateY = clamp(nx * 2 * maxDeg, -maxDeg, maxDeg);
  // Normalize -0 to 0 so consumers and tests don't see signed zero.
  return {
    rotateX: rotateX === 0 ? 0 : rotateX,
    rotateY: rotateY === 0 ? 0 : rotateY,
  };
}

/**
 * Normalize client pointer position relative to a bounding rect
 * into offsets about the center in roughly [-0.5, 0.5].
 */
export function pointerOffsetFromRect(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }
  const x = (clientX - rect.left) / rect.width - 0.5;
  const y = (clientY - rect.top) / rect.height - 0.5;
  return { x: clamp(x, -0.5, 0.5), y: clamp(y, -0.5, 0.5) };
}

export type MagneticOffset = { x: number; y: number };

/**
 * Pull toward the cursor while inside radius; zero outside.
 * Output is translation in px, strength-scaled and capped.
 */
export function magneticOffsetFromPointer(
  clientX: number,
  clientY: number,
  center: { x: number; y: number },
  options?: {
    radius?: number;
    strength?: number;
    maxPx?: number;
  },
): MagneticOffset {
  const radius = options?.radius ?? DEFAULT_MAGNETIC_RADIUS;
  const strength = options?.strength ?? DEFAULT_MAGNETIC_STRENGTH;
  const maxPx = options?.maxPx ?? DEFAULT_MAGNETIC_MAX_PX;

  const dx = clientX - center.x;
  const dy = clientY - center.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0 || distance > radius) {
    return { x: 0, y: 0 };
  }

  // Soft falloff near the edge so the snap-back is smoother.
  const falloff = 1 - distance / radius;
  const x = clamp(dx * strength * falloff, -maxPx, maxPx);
  const y = clamp(dy * strength * falloff, -maxPx, maxPx);
  return { x, y };
}
