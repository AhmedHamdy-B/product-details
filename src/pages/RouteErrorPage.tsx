import type { JSX } from 'react'
import { useRouteError } from 'react-router-dom'

import { useLocale } from '../i18n/useLocale'
import { Button } from '../components/ui/Button'

function messageFromError(error: unknown): string | null {
  if (error instanceof Error) return error.message
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusText' in error &&
    typeof (error as { statusText?: unknown }).statusText === 'string'
  ) {
    return (error as { statusText: string }).statusText
  }
  return null
}

export function RouteErrorPage(): JSX.Element {
  const { t } = useLocale()
  const error = useRouteError()
  const message = messageFromError(error)

  return (
    <div className="min-h-[50vh] bg-jl-white px-6 py-20 text-neutral-950">
      <div className="mx-auto max-w-lg space-y-4 rounded-md border border-neutral-900/15 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-medium tracking-tight">
          {t('fatal.title')}
        </h1>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          {message ?? t('fatal.genericMessage')}
        </p>
        <Button type="button" onClick={() => window.location.reload()} size="sm" rounded="full">
          {t('fatal.reload')}
        </Button>
      </div>
    </div>
  )
}
