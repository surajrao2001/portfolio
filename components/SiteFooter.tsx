import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("mt-auto", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-10 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p className="max-w-md sm:text-right">
          Built with Next.js — static where it should be, dynamic only where it
          must.
        </p>
      </div>
    </footer>
  );
}
