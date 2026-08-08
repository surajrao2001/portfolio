import { describe, expect, it } from "vitest";

import {
  buildContactEmailContent,
  escapeHtml,
} from "@/lib/contact/send-email";

describe("escapeHtml", () => {
  it("escapes markup characters", () => {
    expect(escapeHtml(`<a href="x">O'Brien & co</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;O&#39;Brien &amp; co&lt;/a&gt;",
    );
  });
});

describe("buildContactEmailContent", () => {
  it("builds plain text and subject", () => {
    const content = buildContactEmailContent({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello\nthere",
    });
    expect(content.subject).toContain("Ada");
    expect(content.text).toContain("Name: Ada");
    expect(content.text).toContain("ada@example.com");
    expect(content.text).toContain("Hello\nthere");
    expect(content.html).toContain("Ada");
    expect(content.html).toContain("<br />");
  });

  it("escapes HTML in the HTML body", () => {
    const content = buildContactEmailContent({
      name: "<script>",
      email: "a@b.co",
      message: "x",
    });
    // message min is 10 in schema; builder doesn't re-validate
    expect(content.html).toContain("&lt;script&gt;");
    expect(content.html).not.toContain("<script>");
  });
});
