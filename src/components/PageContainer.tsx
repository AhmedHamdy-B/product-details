import type { JSX, ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * Full-bleed width (no max-width cap) with fixed page gutters across all sections.
 */
export const pageContainerClass = "w-full px-[20px] min-[800px]:px-[80px] min-[1200px]:px-[156px]";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({
  children,
  className,
}: PageContainerProps): JSX.Element {
  return <div className={cn(pageContainerClass, className)}>{children}</div>;
}
