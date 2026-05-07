import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { I18nDocumentSync } from './i18n/I18nDocumentSync'
import './i18n/i18n'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nDocumentSync />
    <RouterProvider router={router} />
  </StrictMode>,
)
