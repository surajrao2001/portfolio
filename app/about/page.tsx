import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, what I build, and how I work.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        About
      </h1>
      <p className="mt-4 text-lg text-ink-muted">
        I build software with a bias toward clear systems, honest trade-offs, and
        interfaces that feel intentional rather than generically polished.
      </p>
      <p className="mt-4 text-ink-muted">
        This portfolio is the public surface of that work — selected projects,
        occasional writing, and a low-friction way to reach me.
      </p>
      <p className="mt-6">
        <Link
          href="/contact"
          className="text-accent underline-offset-4 hover:underline"
        >
          Prefer a short note? Head to contact.
        </Link>
      </p>
    </div>
  );
}
