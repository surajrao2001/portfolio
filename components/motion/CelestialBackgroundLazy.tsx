"use client";

import dynamic from "next/dynamic";

const CelestialBackground = dynamic(
  () =>
    import("@/components/motion/CelestialBackground").then(
      (mod) => mod.CelestialBackground,
    ),
  { ssr: false },
);

/** Lazy-mounts celestial layer client-side so it does not block first paint. */
export function CelestialBackgroundLazy() {
  return <CelestialBackground />;
}
