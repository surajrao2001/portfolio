import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "How I build software — clear systems, honest trade-offs, and interfaces that stay intentional.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-sm font-medium tracking-wide text-accent">About</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        I build software with a bias toward clear systems, honest trade-offs,
        and interfaces that feel intentional rather than generically polished.
      </p>
      <p className="mt-4 leading-relaxed text-ink-muted">
        I care more about the boring middle of a feature than the demo GIF. The
        middle is where judgment shows up — how data moves, what breaks at the
        edges, and whether the result still makes sense once the launch splash
        fades.
      </p>

      <section aria-labelledby="about-focus-heading" className="mt-12">
        <h2
          id="about-focus-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          How I tend to work
        </h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-ink-muted">
          <li>
            Prefer static and simple until a real requirement forces a dynamic
            path — this site has one on purpose: contact.
          </li>
          <li>
            Keep content in the repo when that is enough. Git is a perfectly
            good CMS for a portfolio.
          </li>
          <li>
            Write for a tired, smart reader: one job per section, no filler
            marketing.
          </li>
        </ul>
      </section>

      <section aria-labelledby="about-here-heading" className="mt-12">
        <h2
          id="about-here-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          What you will find here
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Selected projects with the trade-offs left in, occasional writing when
          something was worth explaining, and a low-friction way to reach me.
          If you want the short version of a project: what I built, why the
          trade-offs, what I would do differently next time.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/projects">View projects</Button>
        <Button href="/contact" variant="secondary">
          Get in touch
        </Button>
      </div>
    </div>
  );
}
