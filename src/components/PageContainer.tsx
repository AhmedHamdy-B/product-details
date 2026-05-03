import type { JSX, ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * Full-bleed width (no max-width cap). Phones/tablets: tight gutters; xl+ matches Figma 156px L/R.
 */
export const pageContainerClass = "w-full px-4 sm:px-5 md:px-6 xl:px-[260px]";

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
