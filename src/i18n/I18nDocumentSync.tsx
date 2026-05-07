import { useLayoutEffect, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { messagesAr, messagesEn } from './messages'

function isRtlLanguage(code: string | undefined): boolean {
  const c = code ?? ''
  return c === 'ar' || c.startsWith('ar')
}

/** Keeps `<html lang dir>` and `document.title` in sync with active i18next language. */
export function I18nDocumentSync(): JSX.Element | null {
  const { i18n } = useTranslation()
  const resolved = i18n.resolvedLanguage ?? i18n.language

  useLayoutEffect(() => {
    const isAr = isRtlLanguage(resolved)
    document.documentElement.lang = isAr ? 'ar' : 'en'
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.title = isAr ? messagesAr['doc.titleProduct'] : messagesEn['doc.titleProduct']
  }, [resolved])

  return null
}
