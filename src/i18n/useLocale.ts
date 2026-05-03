import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Locale, MessageKey } from './messages'

function toUiLocale(language: string | undefined): Locale {
  return language?.startsWith('ar') === true ? 'ar' : 'en'
}

export function useLocale() {
  const { t: translate, i18n } = useTranslation()

  const locale = useMemo(
    () => toUiLocale(i18n.resolvedLanguage ?? i18n.language),
    [i18n.language, i18n.resolvedLanguage],
  )

  const setLocale = useCallback(
    (next: Locale) => {
      void i18n.changeLanguage(next)
    },
    [i18n],
  )

  const t = useCallback(
    (key: MessageKey): string => translate<string>(key),
    [translate],
  )

  const tf = useCallback(
    (key: MessageKey, vars: Record<string, string | number>): string =>
      translate<string>(key, vars),
    [translate],
  )

  return { locale, setLocale, t, tf }
}
