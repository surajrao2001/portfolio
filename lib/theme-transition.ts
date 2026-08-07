/**
 * View Transitions helpers for the theme toggle circle wipe.
 * Pure decision helpers are exportable for unit tests; DOM APIs are SSR-guarded.
 */

export const THEME_TOGGLE_X_VAR = "--theme-toggle-x";
export const THEME_TOGGLE_Y_VAR = "--theme-toggle-y";

export type ToggleRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ThemeTransitionOrigin = {
  x: number;
  y: number;
};

export type ThemeTransitionOptions = ThemeTransitionOrigin & {
  update: () => void;
};

/** Minimal document shape for feature detection (injectable in tests). */
export type DocumentLike = {
  startViewTransition?: (callback: () => void | Promise<void>) => unknown;
};

/** Minimal matchMedia shape for reduced-motion checks (injectable in tests). */
export type MatchMediaLike = {
  matchMedia: (query: string) => { matches: boolean };
};

/**
 * Viewport center of a control from getBoundingClientRect()-style metrics.
 */
export function getToggleCenter(rect: ToggleRect): ThemeTransitionOrigin {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Whether a View Transitions wipe should run (supported + motion allowed).
 */
export function shouldUseViewTransition(input: {
  supportsVT: boolean;
  reducedMotion: boolean;
}): boolean {
  return input.supportsVT && !input.reducedMotion;
}

/**
 * Feature-detect `document.startViewTransition`.
 * Returns false during SSR or when the API is absent.
 */
export function supportsViewTransitions(
  doc: DocumentLike | null | undefined = typeof document !== "undefined"
    ? document
    : undefined,
): boolean {
  if (!doc) return false;
  return typeof doc.startViewTransition === "function";
}

/**
 * Detect `prefers-reduced-motion: reduce`.
 * Returns false during SSR or when matchMedia is unavailable.
 */
export function prefersReducedMotion(
  win: MatchMediaLike | null | undefined = typeof window !== "undefined"
    ? window
    : undefined,
): boolean {
  if (!win || typeof win.matchMedia !== "function") return false;
  return win.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Apply theme update with an optional circle wipe from (x, y) viewport coords.
 * Without VT support or when reduced-motion is set, runs `update` immediately.
 */
export function runThemeTransition({
  x,
  y,
  update,
}: ThemeTransitionOptions): void {
  if (typeof document === "undefined") {
    update();
    return;
  }

  if (
    !shouldUseViewTransition({
      supportsVT: supportsViewTransitions(document),
      reducedMotion: prefersReducedMotion(),
    })
  ) {
    update();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty(THEME_TOGGLE_X_VAR, `${x}px`);
  root.style.setProperty(THEME_TOGGLE_Y_VAR, `${y}px`);

  document.startViewTransition(() => {
    update();
  });
}
