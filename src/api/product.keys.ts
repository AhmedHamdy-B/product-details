import { TASK_PRODUCT_SLUG } from './product'

/** Centralized query-key factory to keep cache addressing consistent across features. */
export const productKeys = {
  all: ['product'] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
  taskDetail: () => productKeys.detail(TASK_PRODUCT_SLUG),
}
