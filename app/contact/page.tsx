import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message — the form arrives with the contact feature.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Contact
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        The contact form ships as its own feature (Resend + rate limiting). The
        route is live so navigation, metadata, and layout already match the
        sitemap.
      </p>
      <p className="mt-6 text-ink-muted">
        In the meantime: open an issue on GitHub or connect on LinkedIn via the
        site config once those URLs are finalized.
      </p>
    </div>
  );
}
