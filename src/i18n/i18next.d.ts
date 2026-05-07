import 'i18next'

import type { messagesEn } from './messages'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof messagesEn
    }
  }
}
