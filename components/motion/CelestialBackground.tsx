"use client";

import { useEffect, useState } from "react";

import { generateStarField } from "@/lib/starfield";
import { cn } from "@/lib/cn";

const STAR_COUNT = 72;
const STAR_COUNT_REDUCED = 40;
/** Module-level so seeded output is identical whenever the field is rendered. */
const STARS = generateStarField(STAR_COUNT);
const STARS_REDUCED = generateStarField(STAR_COUNT_REDUCED);

type CelestialBackgroundProps = {
  className?: string;
};

/**
 * Fixed full-viewport celestial sky for light (sun/clouds) and dark (moon/stars).
 * Decorative only — pointer-events none, sits behind readable content.
 */
export function CelestialBackground({ className }: CelestialBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stars = reducedMotion ? STARS_REDUCED : STARS;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Light sky */}
      <div className="absolute inset-0 transition-opacity duration-500 dark:opacity-0">
        <div className="celestial-sky-light absolute inset-0" />
        <div
          className={cn(
            "celestial-sun absolute left-[12%] top-[10%] h-40 w-40 rounded-full sm:h-52 sm:w-52",
            !reducedMotion && "celestial-sun-pulse",
          )}
        />
        {!reducedMotion && (
          <>
            <div className="celestial-cloud celestial-cloud-a absolute left-[-10%] top-[18%] h-24 w-48 rounded-full sm:h-28 sm:w-64" />
            <div className="celestial-cloud celestial-cloud-b absolute right-[-8%] top-[28%] h-20 w-56 rounded-full sm:h-24 sm:w-72" />
            <div className="celestial-cloud celestial-cloud-c absolute left-[30%] top-[42%] h-16 w-40 rounded-full sm:h-20 sm:w-52" />
          </>
        )}
      </div>

      {/* Dark sky */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100">
        <div className="celestial-sky-dark absolute inset-0" />
        <div className="celestial-moon absolute right-[14%] top-[12%] h-28 w-28 rounded-full sm:h-36 sm:w-36" />
        <div className="absolute inset-0">
          {stars.map((star, index) => (
            <span
              key={`${star.x.toFixed(3)}-${star.y.toFixed(3)}-${index}`}
              className={cn(
                "celestial-star absolute rounded-full bg-ink",
                !reducedMotion && "celestial-star-twinkle",
              )}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDelay: reducedMotion ? undefined : `${star.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CelestialBackground;
