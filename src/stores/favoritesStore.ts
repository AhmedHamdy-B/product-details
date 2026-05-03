import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

export type FavoriteItem = {
  productId: string
  slug: string
  name: string
  image: string
  savedAt: number
}

type FavoritesSlice = {
  items: FavoriteItem[]
  drawerOpen: boolean
}

type FavoritesActions = {
  openDrawer: () => void
  closeDrawer: () => void
  toggleProduct: (input: Omit<FavoriteItem, 'savedAt'>) => void
  removeProduct: (productId: string) => void
  isFavorite: (productId: string) => boolean
  /** Total saved products */
  count: () => number
}

export type FavoritesStore = FavoritesSlice & FavoritesActions

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    immer((set, get) => ({
      items: [],
      drawerOpen: false,

      openDrawer: () =>
        set((draft) => {
          draft.drawerOpen = true
        }),
      closeDrawer: () =>
        set((draft) => {
          draft.drawerOpen = false
        }),

      toggleProduct: (input) => {
        set((draft) => {
          const idx = draft.items.findIndex((i) => i.productId === input.productId)
          if (idx >= 0) {
            draft.items.splice(idx, 1)
          } else {
            draft.items.unshift({
              productId: input.productId,
              slug: input.slug,
              name: input.name,
              image: input.image,
              savedAt: Date.now(),
            })
          }
        })
      },

      removeProduct: (productId) => {
        set((draft) => {
          draft.items = draft.items.filter((i) => i.productId !== productId)
        })
      },

      isFavorite: (productId) => get().items.some((i) => i.productId === productId),

      count: () => get().items.length,
    })),
    {
      name: 'elegantsoft-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
