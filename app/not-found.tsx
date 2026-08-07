import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        That page wandered off.
      </h1>
      <p className="mt-4 text-ink-muted">
        Either the URL is wrong, or the content has not been written yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-surface"
      >
        Back home
      </Link>
    </div>
  );
}
