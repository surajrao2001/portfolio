import { describe, expect, it } from "vitest";

import {
  elementIsInteractive,
  shouldEnableCustomCursor,
} from "@/lib/cursor";

describe("shouldEnableCustomCursor", () => {
  it("enables only for fine pointer when motion is not reduced", () => {
    expect(shouldEnableCustomCursor(true, false)).toBe(true);
  });

  it("disables when pointer is not fine", () => {
    expect(shouldEnableCustomCursor(false, false)).toBe(false);
  });

  it("disables when prefers-reduced-motion is reduce", () => {
    expect(shouldEnableCustomCursor(true, true)).toBe(false);
  });

  it("disables when both gates fail", () => {
    expect(shouldEnableCustomCursor(false, true)).toBe(false);
  });
});

describe("elementIsInteractive", () => {
  it("treats navigable anchors as interactive", () => {
    expect(
      elementIsInteractive({ tagName: "A", href: "/about" }),
    ).toBe(true);
    expect(elementIsInteractive({ tagName: "a", href: null })).toBe(false);
  });

  it("treats native controls as interactive", () => {
    for (const tagName of [
      "button",
      "input",
      "select",
      "textarea",
      "summary",
    ]) {
      expect(elementIsInteractive({ tagName })).toBe(true);
    }
  });

  it("treats label[for], ARIA roles, and data-cursor as interactive", () => {
    expect(
      elementIsInteractive({ tagName: "label", htmlFor: "email" }),
    ).toBe(true);
    expect(elementIsInteractive({ tagName: "label" })).toBe(false);
    expect(
      elementIsInteractive({ tagName: "div", role: "button" }),
    ).toBe(true);
    expect(elementIsInteractive({ tagName: "div", role: "link" })).toBe(true);
    expect(
      elementIsInteractive({ tagName: "div", hasDataCursor: true }),
    ).toBe(true);
  });

  it("ignores plain non-interactive nodes", () => {
    expect(elementIsInteractive({ tagName: "p" })).toBe(false);
    expect(elementIsInteractive({ tagName: "span" })).toBe(false);
    expect(elementIsInteractive({ tagName: "div", role: "presentation" })).toBe(
      false,
    );
  });
});
