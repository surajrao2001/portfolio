import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Say what you're trying to do. One message path — no CRM, no fluff.",
};

export default function ContactPage() {
  return (
    <Reveal>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-sm font-medium tracking-wide text-accent">Contact</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Say what you&apos;re trying to do. Skip the &ldquo;hope this finds you
          well.&rdquo;
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          One API route on purpose. Your message goes to a real inbox — rate
          limited so it stays usable.
        </p>

        <ContactForm />

        <p className="mt-10 text-sm text-ink-muted">
          Prefer something else?{" "}
          <a
            href={siteConfig.links.github}
            className="text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          {" · "}
          <a
            href={siteConfig.links.linkedin}
            className="text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </Reveal>
  );
}
