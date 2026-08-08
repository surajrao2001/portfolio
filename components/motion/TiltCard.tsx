"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
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
  DEFAULT_TILT_MAX_DEG,
  pointerOffsetFromRect,
  shouldEnablePointerMotion,
  tiltAnglesFromOffset,
} from "@/lib/motion";

const SPRING: SpringOptions = {
  stiffness: 280,
  damping: 24,
  mass: 0.35,
};

const LIFT_Y = -3;
const HOVER_SHADOW =
  "0 10px 28px -12px rgb(15 23 42 / 0.18), 0 4px 10px -6px rgb(15 23 42 / 0.08)";
const REST_SHADOW = "0 0 0 0 transparent";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Cap absolute tilt in degrees. */
  maxDeg?: number;
};

/**
 * Desktop tilt + soft lift/shadow for card-like surfaces.
 * Caps rotation; transform/opacity only; fine pointer + reduced-motion gated.
 */
export function TiltCard({
  children,
  className,
  maxDeg = DEFAULT_TILT_MAX_DEG,
}: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawLift = useMotionValue(0);
  const rawShadow = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, SPRING);
  const rotateY = useSpring(rawRotateY, SPRING);
  const y = useSpring(rawLift, SPRING);
  const shadowT = useSpring(rawShadow, SPRING);
  const boxShadow = useTransform(shadowT, [0, 1], [REST_SHADOW, HOVER_SHADOW]);

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

  const active = enabled && !reducedMotion;

  const reset = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawLift.set(0);
    rawShadow.set(0);
  }, [rawLift, rawRotateX, rawRotateY, rawShadow]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!active || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = pointerOffsetFromRect(
        event.clientX,
        event.clientY,
        rect,
      );
      const { rotateX: rx, rotateY: ry } = tiltAnglesFromOffset(
        offset.x,
        offset.y,
        maxDeg,
      );
      rawRotateX.set(rx);
      rawRotateY.set(ry);
    },
    [active, maxDeg, rawRotateX, rawRotateY],
  );

  const onPointerEnter = useCallback(() => {
    if (!active) return;
    rawLift.set(LIFT_Y);
    rawShadow.set(1);
  }, [active, rawLift, rawShadow]);

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform [transform-style:preserve-3d]", className)}
      style={{
        rotateX,
        rotateY,
        y,
        boxShadow,
        transformPerspective: 900,
      }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}
