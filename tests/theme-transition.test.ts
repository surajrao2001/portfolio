import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getToggleCenter,
  prefersReducedMotion,
  runThemeTransition,
  shouldUseViewTransition,
  supportsViewTransitions,
  THEME_TOGGLE_X_VAR,
  THEME_TOGGLE_Y_VAR,
} from "@/lib/theme-transition";

describe("getToggleCenter", () => {
  it("returns the viewport center of the rect", () => {
    expect(
      getToggleCenter({ left: 10, top: 20, width: 40, height: 30 }),
    ).toEqual({ x: 30, y: 35 });
  });
});

describe("shouldUseViewTransition", () => {
  it("requires support and allowed motion", () => {
    expect(
      shouldUseViewTransition({ supportsVT: true, reducedMotion: false }),
    ).toBe(true);
    expect(
      shouldUseViewTransition({ supportsVT: false, reducedMotion: false }),
    ).toBe(false);
    expect(
      shouldUseViewTransition({ supportsVT: true, reducedMotion: true }),
    ).toBe(false);
  });
});

describe("supportsViewTransitions", () => {
  it("returns false for nullish docs", () => {
    expect(supportsViewTransitions(null)).toBe(false);
    expect(supportsViewTransitions(undefined)).toBe(false);
  });

  it("returns true only when startViewTransition is a function", () => {
    expect(supportsViewTransitions({})).toBe(false);
    expect(
      supportsViewTransitions({ startViewTransition: vi.fn() }),
    ).toBe(true);
  });
});

describe("prefersReducedMotion", () => {
  it("returns false for nullish windows", () => {
    expect(prefersReducedMotion(null)).toBe(false);
    expect(prefersReducedMotion(undefined)).toBe(false);
  });

  it("reads the reduced-motion media query", () => {
    expect(
      prefersReducedMotion({
        matchMedia: (query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
        }),
      }),
    ).toBe(true);

    expect(
      prefersReducedMotion({
        matchMedia: () => ({ matches: false }),
      }),
    ).toBe(false);
  });
});

describe("runThemeTransition", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("calls update immediately when View Transitions are unsupported", () => {
    const update = vi.fn();
    const startViewTransition = vi.fn();

    vi.stubGlobal("document", {
      startViewTransition,
      documentElement: { style: { setProperty: vi.fn() } },
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });

    // No startViewTransition function → unsupported
    vi.stubGlobal("document", {
      documentElement: { style: { setProperty: vi.fn() } },
    });

    runThemeTransition({ x: 12, y: 34, update });

    expect(update).toHaveBeenCalledOnce();
    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it("calls update immediately when reduced motion is preferred", () => {
    const update = vi.fn();
    const startViewTransition = vi.fn((cb: () => void) => {
      cb();
      return {};
    });
    const setProperty = vi.fn();

    vi.stubGlobal("document", {
      startViewTransition,
      documentElement: { style: { setProperty } },
    });
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
      }),
    });

    runThemeTransition({ x: 12, y: 34, update });

    expect(update).toHaveBeenCalledOnce();
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(setProperty).not.toHaveBeenCalled();
  });

  it("starts a view transition with origin CSS vars when allowed", () => {
    const update = vi.fn();
    const setProperty = vi.fn();
    const startViewTransition = vi.fn((cb: () => void) => {
      cb();
      return {};
    });

    vi.stubGlobal("document", {
      startViewTransition,
      documentElement: { style: { setProperty } },
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });

    runThemeTransition({ x: 120.5, y: 40, update });

    expect(setProperty).toHaveBeenCalledWith(THEME_TOGGLE_X_VAR, "120.5px");
    expect(setProperty).toHaveBeenCalledWith(THEME_TOGGLE_Y_VAR, "40px");
    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
  });
});
