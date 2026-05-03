import type { JSX } from 'react'

type BreadcrumbsProps = {
  crumbs: string[]
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps): JSX.Element {
  return (
    <nav className="text-left text-[12px] leading-relaxed text-[#8a8a8a]" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1">
        {crumbs.map((crumb, index) => {
          const active = index === crumbs.length - 1
          return (
            <li key={`${crumb}-${index}`} className="flex items-center gap-x-1">
              {index !== 0 && (
                <span aria-hidden className="select-none px-1.5 text-[#b0b0b0]">
                  &gt;
                </span>
              )}
              <span
                className={
                  active
                    ? 'max-w-[min(760px,_88vw)] truncate font-semibold text-neutral-900'
                    : 'font-medium text-[#7a7a7a] underline-offset-[5px] hover:text-neutral-800 hover:underline'
                }
              >
                {crumb}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
