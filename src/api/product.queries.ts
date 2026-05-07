import { queryOptions } from '@tanstack/react-query'

import { fetchProductBySlug } from './product'
import { productKeys } from './product.keys'

export function productDetailQuery(slug: string) {
  return queryOptions({
    queryKey: productKeys.detail(slug),
    // Forward AbortSignal from TanStack Query to support request cancellation on fast route changes.
    queryFn: ({ signal }) => fetchProductBySlug(slug, signal),
    // PDP data is fairly static; short staleness window avoids noisy refetch churn.
    staleTime: 60_000,
  })
}
