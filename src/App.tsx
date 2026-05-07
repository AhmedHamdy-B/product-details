import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'
import { Outlet } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { GoToTopButton } from './components/GoToTopButton'
import { SkipToMain } from './components/SkipToMain'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,
    },
  },
})

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SkipToMain />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <GoToTopButton />
    </QueryClientProvider>
  )
}
