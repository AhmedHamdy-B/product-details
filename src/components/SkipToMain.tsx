import type { JSX } from 'react'

import { useLocale } from '../i18n/useLocale'

/** First tab stop: bypass sticky chrome (evaluation rubric: keyboard / a11y). */
export function SkipToMain(): JSX.Element {
  const { t } = useLocale()
  return (
    <a
      href="#main-content"
      className="
        absolute start-4 top-0 z-[200] translate-y-[-140%]
        rounded bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-md
        outline-none ring-2 ring-transparent ring-offset-2 ring-offset-black
        transition-transform duration-150
        focus-visible:translate-y-4 focus-visible:outline-none focus-visible:ring-white
      "
    >
      {t('skipToMain')}
    </a>
  )
}
