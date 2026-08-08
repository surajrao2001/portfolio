import { describe, expect, it } from "vitest";

import {
  CONTACT_RATE_LIMIT,
  CONTACT_RATE_WINDOW,
  getClientIp,
} from "@/lib/contact/rate-limit";

describe("contact rate limit constants", () => {
  it("uses a free-tier-friendly IP window", () => {
    expect(CONTACT_RATE_LIMIT).toBe(5);
    expect(CONTACT_RATE_WINDOW).toBe("1 h");
  });
});

describe("getClientIp", () => {
  it("prefers first x-forwarded-for hop", () => {
    const request = new Request("http://localhost/api/contact", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        "x-real-ip": "198.51.100.1",
      },
    });
    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip", () => {
    const request = new Request("http://localhost/api/contact", {
      headers: { "x-real-ip": "198.51.100.1" },
    });
    expect(getClientIp(request)).toBe("198.51.100.1");
  });

  it("returns unknown without proxy headers", () => {
    const request = new Request("http://localhost/api/contact");
    expect(getClientIp(request)).toBe("unknown");
  });
});
