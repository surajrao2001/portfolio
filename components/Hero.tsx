import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type HeroProps = {
  className?: string;
};

export function Hero({ className }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative isolate overflow-hidden border-b border-ink/10",
        className,
      )}
    >
      {/* Global CelestialBackground supplies the sky; keep only a soft content fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface/80 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[min(88vh,44rem)] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {siteConfig.name}
        </p>
        <h1
          id="hero-heading"
          className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.1]"
        >
          Building products worth looking under the hood of.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          Projects with real systems underneath, writing when something was
          worth explaining, and a contact form that actually emails a person.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Button href="/projects" size="lg">
              View projects
            </Button>
          </Magnetic>
          <Button href="/contact" variant="secondary" size="lg">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
