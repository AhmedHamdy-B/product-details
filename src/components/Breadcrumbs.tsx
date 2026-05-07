import type { JSX } from "react";
import { useLocale } from "../i18n/useLocale";

type BreadcrumbsProps = {
  crumbs: string[];
};

export function Breadcrumbs({ crumbs }: BreadcrumbsProps): JSX.Element {
  const { t } = useLocale();
  const activeCrumb = crumbs[crumbs.length - 1] ?? "";
  const parentCrumbs = crumbs.slice(0, -1);

  return (
    <nav
      className="text-start text-[16px] leading-relaxed text-[#8F8F8F]"
      aria-label={t("a11y.breadcrumbNav")}
    >
      {parentCrumbs.length > 0 && (
        <ol className="flex flex-wrap items-center justify-start gap-x-1.5 gap-y-1">
          {parentCrumbs.map((crumb, index) => (
            <li key={`${crumb}-${index}`} className="flex items-center gap-x-1.5">
              {index !== 0 && (
                <span aria-hidden className="select-none text-[#8F8F8F]">
                  &gt;
                </span>
              )}
              <span className="font-medium">{crumb}</span>
            </li>
          ))}
          <li aria-hidden className="select-none text-[#8F8F8F]">
            &gt;
          </li>
        </ol>
      )}
      {activeCrumb && (
        <p className="mt-1 font-medium text-[#292929] sm:truncate sm:max-w-[min(760px,_88vw)]">
          {activeCrumb}
        </p>
      )}
    </nav>
  );
}
