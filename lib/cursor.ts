/**
 * Pure helpers for the desktop custom cursor (gate + interactive hit targets).
 * DOM walk lives in `isInteractiveTarget`; pure tag/attr rules are unit-tested in node.
 */

/** Normalized attributes used to decide if a single element is interactive. */
export type ElementInteractivityHints = {
  tagName: string;
  href?: string | null;
  role?: string | null;
  hasDataCursor?: boolean;
  htmlFor?: string | null;
};

/**
 * Pure per-element interactivity rules (mirrors browser targets: links, controls,
 * ARIA button/link roles, and optional `data-cursor` opt-in).
 */
export function elementIsInteractive(hints: ElementInteractivityHints): boolean {
  const tag = hints.tagName.toLowerCase();

  if (tag === "a" && Boolean(hints.href)) {
    return true;
  }

  if (
    tag === "button" ||
    tag === "input" ||
    tag === "select" ||
    tag === "textarea" ||
    tag === "summary"
  ) {
    return true;
  }

  if (tag === "label" && Boolean(hints.htmlFor)) {
    return true;
  }

  if (hints.role === "button" || hints.role === "link") {
    return true;
  }

  if (hints.hasDataCursor) {
    return true;
  }

  return false;
}

function hintsFromElement(el: Element): ElementInteractivityHints {
  return {
    tagName: el.tagName,
    href: el.getAttribute("href"),
    role: el.getAttribute("role"),
    hasDataCursor: el.hasAttribute("data-cursor"),
    htmlFor: el.getAttribute("for"),
  };
}

/**
 * True when the event target or an ancestor is an interactive control.
 * Safe to call with non-elements / null (returns false).
 */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  let current: Element | null = target;
  while (current) {
    if (elementIsInteractive(hintsFromElement(current))) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

/**
 * Custom cursor is desktop-only and must fully yield to reduced motion.
 * Enable only when the pointer is fine and motion is not reduced.
 */
export function shouldEnableCustomCursor(
  pointerFine: boolean,
  reducedMotion: boolean,
): boolean {
  return pointerFine && !reducedMotion;
}
