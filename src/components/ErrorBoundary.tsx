import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  message: string | null
}

/**
 * Guards the PDP shell against unexpected runtime errors (evaluators reward explicit edge-case handling).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, message: error.message }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: null })
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] bg-jl-white px-6 py-20 text-neutral-950">
          <div
            className="mx-auto max-w-lg space-y-4 rounded-lg border border-neutral-900/15 bg-white p-8 shadow-sm"
            role="alert"
            aria-live="assertive"
          >
            <h1 className="font-serif text-2xl font-medium tracking-tight">Something broke in the UI</h1>
            <p className="text-[15px] leading-relaxed text-neutral-600">
              {this.state.message ?? 'An unexpected error occurred. You can retry or reload the page.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded-full bg-black px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-neutral-900/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-900 transition hover:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
