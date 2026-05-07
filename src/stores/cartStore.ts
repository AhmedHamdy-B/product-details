import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

const CART_STORAGE_KEY = 'elegantsoft-cart'
const CART_PERSIST_VERSION = 2

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
export type AddCartItemInput = Omit<CartLine, 'id' | 'quantity'> & { quantity?: number }

type CartSlice = {
  lines: CartLine[]
  drawerOpen: boolean
  toast: CartToastKind | null
}

type CartActions = {
  openDrawer: () => void
  closeDrawer: () => void
  dismissToast: () => void

  addItem: (payload: AddCartItemInput) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

export type CartStore = CartSlice & CartActions

/** Prefer crypto UUIDs when available; fallback keeps SSR/tests functional. */
function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/** Canonicalize option maps so logical-equal selections produce the same identity key. */
function normalizeSelections(selections: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(selections)
      .filter(([, value]) => Boolean(value))
      .sort(([a], [b]) => a.localeCompare(b)),
  )
}

/** Line identity excludes quantity so equal product/config rows merge in-cart. */
function lineIdentity(payload: {
  slug: string
  variantId?: string | null
  selections: Record<string, string>
}): string {
  const parts = Object.entries(normalizeSelections(payload.selections)).map(
    ([key, value]) => `${key}:${value}`,
  )
  return `${payload.slug}::${payload.variantId ?? 'none'}::${parts.join('|')}`
}

type PersistedCartV1 = { lines?: CartLine[] }
type PersistedCartState = Pick<CartStore, 'lines' | 'drawerOpen' | 'toast'>

/** Guard against malformed persisted/API prices that could break totals. */
function normalizeUnitPrice(value: number): number {
  return Number.isFinite(value) && value >= 0 ? value : 0
}

/** Create a persisted-ready line from user action input with normalized fields. */
function toCartLine(payload: AddCartItemInput): CartLine {
  const quantity = Math.max(1, payload.quantity ?? 1)
  return {
    id: createId(),
    productId: payload.productId,
    slug: payload.slug,
    name: payload.name,
    image: payload.image,
    quantity,
    variantId: payload.variantId ?? null,
    selections: normalizeSelections(payload.selections),
    unitPrice: normalizeUnitPrice(payload.unitPrice),
  }
}

/** Look up an existing line by deterministic identity, not by generated id. */
function findMatchingLine(lines: CartLine[], payload: AddCartItemInput): CartLine | undefined {
  const incomingIdentity = lineIdentity(payload)
  return lines.find((line) => lineIdentity(line) === incomingIdentity)
}

function migratePersistedCart(
  persistedState: unknown,
  version: number,
): PersistedCartState {
  // Migration strategy: always rehydrate into a safe runtime shape.
  const prior = (persistedState ?? {}) as PersistedCartV1
  if (version < CART_PERSIST_VERSION) {
    return {
      lines: (prior.lines ?? []).map((line) => ({
        ...line,
        selections: normalizeSelections(line.selections ?? {}),
        unitPrice: normalizeUnitPrice(line.unitPrice),
      })),
      drawerOpen: false,
      toast: null,
    }
  }

  const state = (persistedState ?? {}) as Partial<PersistedCartState>
  return {
    lines: Array.isArray(state.lines)
      ? state.lines.map((line) => ({
          ...line,
          selections: normalizeSelections(line.selections ?? {}),
          unitPrice: normalizeUnitPrice(line.unitPrice),
        }))
      : [],
    drawerOpen: false,
    toast: null,
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
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
          const match = findMatchingLine(draft.lines, payload)
          if (match) {
            // Same variant/config: accumulate quantity instead of duplicating row.
            match.quantity += quantity
          } else {
            draft.lines.push(toCartLine(payload))
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
    })),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      version: CART_PERSIST_VERSION,
      migrate: migratePersistedCart,
    },
  ),
)
