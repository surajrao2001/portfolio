import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building products and shipping carefully.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Posts will appear here from Markdown/MDX in the repo — no CMS, no ghost
        drafts pretending to be live.
      </p>
    </div>
  );
}
