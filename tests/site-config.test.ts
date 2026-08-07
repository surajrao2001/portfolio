import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("exposes required identity fields", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
    expect(siteConfig.title.length).toBeGreaterThan(0);
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("includes primary sitemap routes in nav", () => {
    const hrefs = siteConfig.nav.map((item) => item.href);
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/about", "/projects", "/blog", "/contact"]),
    );
  });
});
