import type { JSX } from "react";

type BreadcrumbsProps = {
  crumbs: string[];
};

export function Breadcrumbs({ crumbs }: BreadcrumbsProps): JSX.Element {
  return (
    <nav
      className="text-start text-[16px] leading-relaxed text-[#8F8F8F]"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1">
        {crumbs.map((crumb, index) => {
          const active = index === crumbs.length - 1;
          return (
            <li key={`${crumb}-${index}`} className="flex items-center gap-x-1">
              {index !== 0 && (
                <span aria-hidden className="select-none px-1.5 text-[#8F8F8F]">
                  &gt;
                </span>
              )}
              <span
                className={
                  active
                    ? "max-w-[min(760px,_88vw)] truncate font-semibold  text-[#292929]"
                    : "font-medium  underline-offset-[5px] hover: text-[#8F8F8F] hover:underline"
                }
              >
                {crumb}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
