import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'

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
      <ProductDetailPage />
      <GoToTopButton />
    </QueryClientProvider>
  )
}
