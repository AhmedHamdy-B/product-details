import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartLine = {
  id: string
  productId: string
  slug: string
  name: string
  image: string
  quantity: number
  variantId?: string | null
  selections: Record<string, string>
  /** Unit price charged */
  unitPrice: number
}

export type CartToastKind = 'item_added'

type CartSlice = {
  lines: CartLine[]
  drawerOpen: boolean
  toast: CartToastKind | null
}

type CartActions = {
  openDrawer: () => void
  closeDrawer: () => void
  dismissToast: () => void

  addItem: (payload: Omit<CartLine, 'id' | 'quantity'> & { quantity?: number }) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  clear: () => void

  getTotal: () => number
  getUniqueCount: () => number
}

export type CartStore = CartSlice & CartActions

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      lines: [],
      drawerOpen: false,
      toast: null,

      openDrawer: () =>
        set((draft) => {
          draft.drawerOpen = true
        }),
      closeDrawer: () =>
        set((draft) => {
          draft.drawerOpen = false
        }),
      dismissToast: () =>
        set((draft) => {
          draft.toast = null
        }),

      addItem: (payload) => {
        const quantity = Math.max(1, payload.quantity ?? 1)
        set((draft) => {
          const match = draft.lines.find(
            (line) =>
              line.slug === payload.slug &&
              line.variantId === payload.variantId &&
              JSON.stringify(line.selections) === JSON.stringify(payload.selections),
          )
          if (match) {
            match.quantity += quantity
          } else {
            draft.lines.push({
              id: createId(),
              productId: payload.productId,
              slug: payload.slug,
              name: payload.name,
              image: payload.image,
              quantity,
              variantId: payload.variantId ?? null,
              selections: payload.selections,
              unitPrice: payload.unitPrice,
            })
          }
          draft.toast = 'item_added'
          /* Basket opens only from Checkout Now or header — not on every add */
        })
      },

      setQuantity: (lineId, quantity) => {
        set((draft) => {
          const line = draft.lines.find((l) => l.id === lineId)
          if (!line) return
          if (quantity <= 0) {
            draft.lines = draft.lines.filter((l) => l.id !== lineId)
          } else {
            line.quantity = quantity
          }
        })
      },

      removeLine: (lineId) => {
        set((draft) => {
          draft.lines = draft.lines.filter((l) => l.id !== lineId)
        })
      },

      clear: () => {
        set((draft) => {
          draft.lines = []
        })
      },

      getTotal: () =>
        get().lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),

      getUniqueCount: () => get().lines.reduce((sum, line) => sum + line.quantity, 0),
    })),
    {
      name: 'elegantsoft-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)
