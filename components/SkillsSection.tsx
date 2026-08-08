import { Reveal } from "@/components/motion/Reveal";
import { skillGroups } from "@/lib/skills";
import { cn } from "@/lib/cn";

type SkillsSectionProps = {
  className?: string;
};

export function SkillsSection({ className }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className={cn(className)}
    >
      <Reveal>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-medium tracking-wide text-accent">
            The toolbox
          </p>
          <h2
            id="skills-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Skills
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-muted">
            Tools I actually reach for — some daily, some often enough to trust
            in a real codebase. Not a keyword dump for ATS robots.
          </p>

          <div className="mt-10 space-y-10">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-medium tracking-wide text-ink">
                  {group.label}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <span className="inline-flex rounded-md bg-surface-raised/80 px-3 py-1.5 text-sm text-ink ring-1 ring-ink/8">
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
