import type { CartStore } from './cartStore'
import type { FavoritesStore } from './favoritesStore'

/** Total units across lines (used for cart badge and mobile header). */
export const selectCartItemsCount = (state: CartStore): number =>
  state.lines.reduce((sum, line) => sum + line.quantity, 0)

/** Derived subtotal before shipping/taxes. */
export const selectCartTotal = (state: CartStore): number =>
  state.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)

/** Small selector to keep favorites badge subscription narrow. */
export const selectFavoritesCount = (state: FavoritesStore): number => state.items.length

/** Factory selector for per-product save state without recomputing callers. */
export const selectIsFavoriteByProductId =
  (productId: string) =>
  (state: FavoritesStore): boolean =>
    state.items.some((item) => item.productId === productId)
