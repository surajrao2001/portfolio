"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/cn";
import {
  getToggleCenter,
  runThemeTransition,
} from "@/lib/theme-transition";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const { x, y } = getToggleCenter(event.currentTarget.getBoundingClientRect());
    const nextTheme = isDark ? "light" : "dark";

    runThemeTransition({
      x,
      y,
      update: () => {
        // Flush so the class swap lands inside the View Transition callback.
        flushSync(() => {
          setTheme(nextTheme);
        });
      },
    });
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleToggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface-raised/90 text-ink shadow-sm ring-1 ring-ink/10 transition-colors",
        "hover:bg-accent-soft/50 hover:text-accent hover:ring-accent/30",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      {!mounted ? (
        <span aria-hidden className="h-4 w-4 rounded-full bg-ink/20" />
      ) : isDark ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M17.99 17.99l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M17.99 6.01l1.06-1.06" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
    </svg>
  );
}
