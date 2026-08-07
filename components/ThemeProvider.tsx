"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * Client wrapper for next-themes: class-based light/dark, system preference,
 * and localStorage persistence.
 *
 * Keep `disableTransitionOnChange` so CSS color transitions do not fight the
 * circle wipe. The wipe is owned by ThemeToggle + `lib/theme-transition`.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
