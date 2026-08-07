import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-sm font-medium tracking-wide text-accent">
        {siteConfig.name}
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Building products worth looking under the hood of.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-ink-muted">
        This site is scaffolding for projects, writing, and contact — Jamstack
        content with one purposeful API route when we get there.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
        >
          View projects
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-surface-raised px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
