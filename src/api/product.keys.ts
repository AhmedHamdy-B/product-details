import { TASK_PRODUCT_SLUG } from './product'

export const productKeys = {
  all: ['product'] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
  taskDetail: () => productKeys.detail(TASK_PRODUCT_SLUG),
}
