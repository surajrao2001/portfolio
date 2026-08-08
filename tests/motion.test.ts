import { describe, expect, it } from "vitest";

import {
  clamp,
  magneticOffsetFromPointer,
  pointerOffsetFromRect,
  shouldAnimateMotion,
  shouldEnablePointerMotion,
  tiltAnglesFromOffset,
  DEFAULT_TILT_MAX_DEG,
} from "@/lib/motion";

describe("shouldEnablePointerMotion", () => {
  it("enables only for fine pointer when motion is not reduced", () => {
    expect(shouldEnablePointerMotion(true, false)).toBe(true);
  });

  it("disables when pointer is not fine", () => {
    expect(shouldEnablePointerMotion(false, false)).toBe(false);
  });

  it("disables when prefers-reduced-motion is reduce", () => {
    expect(shouldEnablePointerMotion(true, true)).toBe(false);
  });
});

describe("shouldAnimateMotion", () => {
  it("animates when motion is not reduced", () => {
    expect(shouldAnimateMotion(false)).toBe(true);
  });

  it("skips when reduced motion is preferred", () => {
    expect(shouldAnimateMotion(true)).toBe(false);
  });
});

describe("clamp", () => {
  it("clamps below and above the range", () => {
    expect(clamp(-2, -1, 1)).toBe(-1);
    expect(clamp(2, -1, 1)).toBe(1);
    expect(clamp(0.25, -1, 1)).toBe(0.25);
  });
});

describe("tiltAnglesFromOffset", () => {
  it("maps center offset to zero rotation", () => {
    expect(tiltAnglesFromOffset(0, 0, 5)).toEqual({
      rotateX: 0,
      rotateY: 0,
    });
  });

  it("caps rotation at maxDeg", () => {
    const max = DEFAULT_TILT_MAX_DEG;
    const edge = tiltAnglesFromOffset(0.5, 0.5, max);
    expect(Math.abs(edge.rotateX)).toBeLessThanOrEqual(max);
    expect(Math.abs(edge.rotateY)).toBeLessThanOrEqual(max);
    expect(edge.rotateX).toBe(-max);
    expect(edge.rotateY).toBe(max);
  });

  it("clamps offsets outside [-0.5, 0.5]", () => {
    const far = tiltAnglesFromOffset(2, -2, 4);
    expect(far.rotateX).toBe(4);
    expect(far.rotateY).toBe(4);
  });
});

describe("pointerOffsetFromRect", () => {
  const rect = { left: 100, top: 50, width: 200, height: 100 };

  it("returns center for midpoint of rect", () => {
    expect(pointerOffsetFromRect(200, 100, rect)).toEqual({ x: 0, y: 0 });
  });

  it("returns edges for corners", () => {
    expect(pointerOffsetFromRect(100, 50, rect)).toEqual({
      x: -0.5,
      y: -0.5,
    });
    expect(pointerOffsetFromRect(300, 150, rect)).toEqual({
      x: 0.5,
      y: 0.5,
    });
  });

  it("handles zero-size rect safely", () => {
    expect(
      pointerOffsetFromRect(10, 10, { left: 0, top: 0, width: 0, height: 0 }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe("magneticOffsetFromPointer", () => {
  const center = { x: 100, y: 100 };

  it("returns zero outside the attraction radius", () => {
    expect(
      magneticOffsetFromPointer(300, 100, center, { radius: 72 }),
    ).toEqual({ x: 0, y: 0 });
  });

  it("pulls toward the cursor inside the radius", () => {
    const next = magneticOffsetFromPointer(120, 100, center, {
      radius: 80,
      strength: 0.5,
      maxPx: 20,
    });
    expect(next.x).toBeGreaterThan(0);
    expect(next.y).toBe(0);
    expect(Math.abs(next.x)).toBeLessThanOrEqual(20);
  });

  it("hard-caps translation", () => {
    const next = magneticOffsetFromPointer(150, 100, center, {
      radius: 100,
      strength: 1,
      maxPx: 4,
    });
    expect(Math.abs(next.x)).toBeLessThanOrEqual(4);
  });
});
