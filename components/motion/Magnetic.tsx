"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type SpringOptions,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";
import {
  DEFAULT_MAGNETIC_MAX_PX,
  DEFAULT_MAGNETIC_RADIUS,
  DEFAULT_MAGNETIC_STRENGTH,
  magneticOffsetFromPointer,
  shouldEnablePointerMotion,
} from "@/lib/motion";

const SPRING: SpringOptions = {
  stiffness: 320,
  damping: 22,
  mass: 0.4,
};

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Attraction radius in px. */
  radius?: number;
  /** Pull strength (0–1). */
  strength?: number;
  /** Hard max translation in px. */
  maxPx?: number;
};

/**
 * Shifts its child slightly toward the cursor within a small radius.
 * Fine pointer only; disabled when prefers-reduced-motion is set.
 * Wraps any child (e.g. server `Button`) without requiring Button to be client.
 */
export function Magnetic({
  children,
  className,
  radius = DEFAULT_MAGNETIC_RADIUS,
  strength = DEFAULT_MAGNETIC_STRENGTH,
  maxPx = DEFAULT_MAGNETIC_MAX_PX,
}: MagneticProps) {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    const pointerMq = window.matchMedia("(pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setEnabled(
        shouldEnablePointerMotion(pointerMq.matches, motionMq.matches),
      );
    };

    sync();
    pointerMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);
    return () => {
      pointerMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  // Respect Framer's useReducedMotion as an additional gate.
  const active = enabled && !reducedMotion;

  const reset = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!active || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const next = magneticOffsetFromPointer(
        event.clientX,
        event.clientY,
        center,
        { radius, strength, maxPx },
      );
      rawX.set(next.x);
      rawY.set(next.y);
    },
    [active, maxPx, radius, rawX, rawY, strength],
  );

  if (!active) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex will-change-transform", className)}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}
