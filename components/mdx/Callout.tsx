import { cn } from "@/lib/cn";

type CalloutProps = {
  title?: string;
  tone?: "info" | "warn" | "tip";
  children: React.ReactNode;
};

const toneStyles: Record<NonNullable<CalloutProps["tone"]>, string> = {
  info: "border-accent/40 bg-accent-soft/60",
  warn: "border-amber-500/40 bg-amber-500/10",
  tip: "border-emerald-600/35 bg-emerald-600/10",
};

export function Callout({
  title,
  tone = "info",
  children,
}: CalloutProps) {
  return (
    <aside
      className={cn(
        "my-6 rounded-md border px-4 py-3 text-sm leading-relaxed text-ink",
        toneStyles[tone],
      )}
    >
      {title ? (
        <p className="mb-1 font-semibold tracking-tight">{title}</p>
      ) : null}
      <div className="text-ink-muted [&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline">
        {children}
      </div>
    </aside>
  );
}
