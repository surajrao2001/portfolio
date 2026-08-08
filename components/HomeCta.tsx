import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type HomeCtaProps = {
  className?: string;
};

export function HomeCta({ className }: HomeCtaProps) {
  return (
    <section
      aria-labelledby="home-cta-heading"
      className={cn(className)}
    >
      <Reveal>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-2xl bg-surface-raised/80 px-6 py-12 ring-1 ring-ink/8 sm:px-10 sm:py-14">
            <h2
              id="home-cta-heading"
              className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              Let&apos;s build something that holds up past the demo.
            </h2>
            <p className="mt-4 max-w-lg text-lg text-ink-muted">
              Open to full-time, contract, and focused collabs. Say what you are
              trying to ship — skip the warm-up email template.
            </p>
            <div className="mt-8">
              <Magnetic>
                <Button href="/contact" size="lg">
                  Start a conversation
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
