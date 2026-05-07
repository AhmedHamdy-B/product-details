import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

const FAVORITES_STORAGE_KEY = 'elegantsoft-favorites'
const FAVORITES_PERSIST_VERSION = 2

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
}

export type FavoritesStore = FavoritesSlice & FavoritesActions
type PersistedFavoritesV1 = { items?: FavoriteItem[] }
type PersistedFavoritesState = Pick<FavoritesStore, 'items' | 'drawerOpen'>

/** Keep favorites resilient to bad persisted payloads. */
function sanitizeFavorites(items: FavoriteItem[]): FavoriteItem[] {
  return items
    .filter((item) => Boolean(item.productId))
    .map((item) => ({
      ...item,
      savedAt: Number.isFinite(item.savedAt) ? item.savedAt : Date.now(),
    }))
}

function migratePersistedFavorites(
  persistedState: unknown,
  version: number,
): PersistedFavoritesState {
  // Migration strategy: normalize historical versions into the current runtime shape.
  const prior = (persistedState ?? {}) as PersistedFavoritesV1
  if (version < FAVORITES_PERSIST_VERSION) {
    return {
      items: sanitizeFavorites(prior.items ?? []),
      drawerOpen: false,
    }
  }

  const state = (persistedState ?? {}) as Partial<PersistedFavoritesState>
  return {
    items: sanitizeFavorites(state.items ?? []),
    drawerOpen: false,
  }
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    immer((set) => ({
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
            // Toggle off when already saved.
            draft.items.splice(idx, 1)
          } else {
            // New saves appear first for a better drawer experience.
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
    })),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: FAVORITES_PERSIST_VERSION,
      migrate: migratePersistedFavorites,
    },
  ),
)
