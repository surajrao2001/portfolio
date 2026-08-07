import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type AboutTeaserProps = {
  className?: string;
};

export function AboutTeaser({ className }: AboutTeaserProps) {
  return (
    <section
      aria-labelledby="about-teaser-heading"
      className={cn("border-b border-ink/10", className)}
    >
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end md:gap-12">
        <div>
          <p className="text-sm font-medium tracking-wide text-accent">About</p>
          <h2
            id="about-teaser-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            The boring middle is the interesting part.
          </h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-ink-muted">
            I care more about the boring middle of a feature than the demo GIF.
            The middle is where judgment shows up — constraints, trade-offs, and
            the parts that still work six months later.
          </p>
          <div className="mt-6">
            <Button href="/about" variant="ghost">
              More about how I work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
