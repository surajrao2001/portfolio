import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and case write-ups.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Case write-ups land here once the MDX content pipeline is live.
        Until then, the list stays empty on purpose rather than faking cards.
      </p>
      <p className="mt-6 text-sm text-ink-muted">
        Want the short version by email?{" "}
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>
        .
      </p>
    </div>
  );
}
