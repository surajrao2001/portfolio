import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-ink/10 bg-surface/90 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
