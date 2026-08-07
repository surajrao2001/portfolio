import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent text-surface hover:opacity-90 focus-visible:outline-accent",
  secondary:
    "border border-ink/15 bg-surface-raised/80 text-ink hover:border-ink/30 focus-visible:outline-accent",
  ghost:
    "text-ink-muted hover:text-ink underline-offset-4 hover:underline focus-visible:outline-accent",
} as const;

const sizes = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm sm:text-base",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof SharedProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-[opacity,color,border-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  const buttonProps = props as ButtonAsButton;
  return <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps} />;
}
