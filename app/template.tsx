import { PageTransition } from "@/components/motion/PageTransition";

type TemplateProps = {
  children: React.ReactNode;
};

/**
 * App Router templates remount on client navigations — ideal for enter fades
 * without wrapping the root layout (header/footer/theme stay stable).
 */
export default function Template({ children }: TemplateProps) {
  return <PageTransition>{children}</PageTransition>;
}
