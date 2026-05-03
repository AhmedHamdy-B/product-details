import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { I18nDocumentSync } from './i18n/I18nDocumentSync'
import './i18n/i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nDocumentSync />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
