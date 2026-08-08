"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { shouldAnimateMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Optional HTML element / motion tag. Defaults to div. */
  as?: "div" | "section" | "header" | "li";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Subtle fade + slide-up when a major section enters the viewport.
 * Skips animation when prefers-reduced-motion is set.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const animate = shouldAnimateMotion(Boolean(reducedMotion));
  const MotionTag = motion[as];

  if (!animate) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.2 }}
      transition={{
        duration: 0.45,
        ease: EASE,
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
