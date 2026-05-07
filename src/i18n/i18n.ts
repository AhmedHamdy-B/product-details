import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { LOCALE_STORAGE_KEY } from './localeStorage'
import { i18nResources } from './resources'

// Locale strategy:
// - read/write from project-owned localStorage key first
// - fallback to browser navigator language
// - normalize region variants (e.g. en-GB -> en) via `load: languageOnly`.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: i18nResources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    load: 'languageOnly',
  })

export default i18n
