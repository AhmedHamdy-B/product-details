import { queryOptions } from '@tanstack/react-query'

import { fetchProductBySlug } from './product'
import { productKeys } from './product.keys'

export function productDetailQuery(slug: string) {
  return queryOptions({
    queryKey: productKeys.detail(slug),
    queryFn: ({ signal }) => fetchProductBySlug(slug, signal),
    staleTime: 60_000,
  })
}
