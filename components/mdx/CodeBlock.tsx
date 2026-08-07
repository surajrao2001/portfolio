import { cn } from "@/lib/cn";

type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Lightweight fenced-code renderer for MDX.
 * Syntax highlighting can plug in later without changing call sites.
 */
export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-md border border-ink/10 bg-ink/[0.04] p-4 text-sm leading-relaxed text-ink [&>code]:font-mono [&>code]:text-[0.9em]",
        className,
      )}
    >
      {children}
    </pre>
  );
}
