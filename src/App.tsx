import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'

import { ErrorBoundary } from './components/ErrorBoundary'
import { GoToTopButton } from './components/GoToTopButton'
import { ProductDetailPage } from './pages/ProductDetailPage'

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
      <ErrorBoundary>
        <ProductDetailPage />
      </ErrorBoundary>
      <GoToTopButton />
    </QueryClientProvider>
  )
}
