import { describe, expect, it } from "vitest";

import {
  CONTACT_MESSAGE_MAX,
  CONTACT_MESSAGE_MIN,
  CONTACT_NAME_MAX,
  HONEYPOT_FIELD,
  isHoneypotTriggered,
  parseContactBody,
  contactBodySchema,
} from "@/lib/contact/schema";

const validBase = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I want to talk about a paid collaboration on a data product.",
};

describe("contactBodySchema", () => {
  it("accepts a valid payload", () => {
    const result = contactBodySchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada Lovelace");
      expect(result.data[HONEYPOT_FIELD]).toBe("");
    }
  });

  it("trims fields", () => {
    const result = contactBodySchema.safeParse({
      name: "  Ada  ",
      email: "  ada@example.com  ",
      message: `  ${validBase.message}  `,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada");
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects empty name", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      name: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      message: "hi",
    });
    expect(result.success).toBe(false);
  });

  it("rejects overlong name", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      name: "x".repeat(CONTACT_NAME_MAX + 1),
    });
    expect(result.success).toBe(false);
  });

  it("rejects overlong message", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      message: "m".repeat(CONTACT_MESSAGE_MAX + 1),
    });
    expect(result.success).toBe(false);
  });

  it("accepts message at min length", () => {
    const result = contactBodySchema.safeParse({
      ...validBase,
      message: "a".repeat(CONTACT_MESSAGE_MIN),
    });
    expect(result.success).toBe(true);
  });
});

describe("isHoneypotTriggered", () => {
  it("is false for empty/missing", () => {
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered("   ")).toBe(false);
  });

  it("is true when filled", () => {
    expect(isHoneypotTriggered("https://spam.example")).toBe(true);
  });
});

describe("parseContactBody", () => {
  it("flags honeypot when website is filled", () => {
    const result = parseContactBody({
      ...validBase,
      [HONEYPOT_FIELD]: "http://bot.example",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.honeypot).toBe(true);
    }
  });

  it("returns field errors for invalid body", () => {
    const result = parseContactBody({ name: "", email: "x", message: "short" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    }
  });

  it("succeeds without honeypot key", () => {
    const result = parseContactBody(validBase);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.honeypot).toBe(false);
    }
  });
});
