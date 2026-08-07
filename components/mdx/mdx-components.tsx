import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";

export const mdxComponents: MDXComponents = {
  Callout,
  h1: (props) => (
    <h1
      className="mt-10 scroll-mt-24 font-display text-3xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-24 font-display text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 font-display text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-4 leading-relaxed text-ink-muted" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-accent underline-offset-4 hover:underline"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-muted" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-accent/50 pl-4 text-ink-muted italic"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-ink/10" {...props} />,
  pre: ({ children, ...props }) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.includes("language-"));
    if (isFenced) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-ink"
        {...props}
      >
        {children}
      </code>
    );
  },
};
