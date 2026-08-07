"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "framer-motion";
import { useEffect, useState } from "react";

import {
  isInteractiveTarget,
  shouldEnableCustomCursor,
} from "@/lib/cursor";
import { cn } from "@/lib/cn";

/** Base ring diameter in px — half-offset centers the transforms on the pointer. */
const CURSOR_SIZE = 14;

const SPRING: SpringOptions = {
  stiffness: 480,
  damping: 32,
  mass: 0.35,
};

const BODY_CURSOR_CLASS = "custom-cursor-active";

/**
 * Hand-rolled spring cursor (Framer Motion only). Desktop fine-pointer only;
 * fully off when prefers-reduced-motion is reduce. Decorative — never captures clicks.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const rawScale = useMotionValue(1);
  const rawOpacity = useMotionValue(0);

  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const scale = useSpring(rawScale, SPRING);
  const opacity = useSpring(rawOpacity, {
    stiffness: 500,
    damping: 40,
    mass: 0.25,
  });

  useEffect(() => {
    const pointerMq = window.matchMedia("(pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncGate = () => {
      setEnabled(
        shouldEnableCustomCursor(pointerMq.matches, motionMq.matches),
      );
    };

    syncGate();
    pointerMq.addEventListener("change", syncGate);
    motionMq.addEventListener("change", syncGate);

    return () => {
      pointerMq.removeEventListener("change", syncGate);
      motionMq.removeEventListener("change", syncGate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove(BODY_CURSOR_CLASS);
      rawOpacity.set(0);
      setInteractive(false);
      return;
    }

    document.body.classList.add(BODY_CURSOR_CLASS);

    const half = CURSOR_SIZE / 2;

    const onPointerMove = (event: PointerEvent) => {
      rawX.set(event.clientX - half);
      rawY.set(event.clientY - half);
      rawOpacity.set(1);
      setInteractive(isInteractiveTarget(event.target));
    };

    const hide = () => {
      rawOpacity.set(0);
      setInteractive(false);
    };

    // html mouseleave fires when the pointer leaves the viewport
    const onDocumentLeave = () => hide();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocumentLeave);
    window.addEventListener("blur", hide);

    return () => {
      document.body.classList.remove(BODY_CURSOR_CLASS);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        onDocumentLeave,
      );
      window.removeEventListener("blur", hide);
    };
  }, [enabled, rawOpacity, rawX, rawY]);

  useEffect(() => {
    rawScale.set(interactive ? 2.35 : 1);
  }, [interactive, rawScale]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[100] rounded-full border-2 border-accent",
        "will-change-transform",
        interactive ? "bg-transparent" : "bg-accent/90",
      )}
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        x,
        y,
        scale,
        opacity,
      }}
    />
  );
}
