"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { shouldAnimateMotion } from "@/lib/motion";

type PageTransitionProps = {
  children: ReactNode;
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Soft enter fade for route changes.
 *
 * Used from `app/template.tsx`, which remounts on navigation in the App Router.
 * That gives a continuous cross-fade feel without a FrozenRouter (internal
 * Next.js context) and without fighting RSC streaming/hydration.
 *
 * Exit animations via AnimatePresence would require freezing the previous
 * segment tree; we intentionally keep enter-only opacity (+ tiny y) here.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const reducedMotion = useReducedMotion();
  const animate = shouldAnimateMotion(Boolean(reducedMotion));

  if (!animate) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
