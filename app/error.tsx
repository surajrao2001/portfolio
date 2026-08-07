"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Something broke on our side.
      </h1>
      <p className="mt-4 text-ink-muted">
        The page hit an unexpected error. You can retry or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-surface"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex rounded-md border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
