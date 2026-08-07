"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () =>
    import("@/components/motion/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

/** Lazy-mounts the custom cursor client-side so it does not block first paint. */
export function CustomCursorLazy() {
  return <CustomCursor />;
}
