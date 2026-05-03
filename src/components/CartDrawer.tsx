import { X } from 'lucide-react'
import { Fragment, type JSX } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { formatMoney } from '../lib/money'
import { useCartStore } from '../stores/cartStore'

export function CartDrawer(): JSX.Element {
  const open = useCartStore((state) => state.drawerOpen)
  const close = useCartStore((state) => state.closeDrawer)
  const lines = useCartStore((state) => state.lines)
  const changeQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.removeLine)

  const grandTotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-[70]">
      <DialogBackdrop transition className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 z-[80] flex justify-end">
        <DialogPanel
          transition
          className="flex h-full w-full max-w-xl flex-col gap-6 border-l border-neutral-900 bg-white px-6 py-8 shadow-2xl data-[closed]:translate-x-6 data-[closed]:opacity-0"
        >
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-serif text-[28px] font-medium">Your basket</DialogTitle>
            <button
              type="button"
              aria-label="Close basket"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black text-black transition hover:bg-neutral-100"
              onClick={close}
            >
              <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
            </button>
          </div>

          {lines.length === 0 ? (
            <p className="text-[15px] text-neutral-600">Your basket is resting for now.</p>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1">
                <ul className="space-y-5">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-5 border-b border-neutral-900/10 pb-6">
                      <img
                        src={line.image}
                        alt=""
                        className="h-24 w-24 border border-neutral-900/10 bg-jl-gray object-cover"
                      />

                      <div className="flex flex-1 flex-col gap-4 text-[13px] font-semibold uppercase tracking-[0.35em]">
                        <div>
                          <p className="normal-case text-neutral-600">John Lewis ANYDAY</p>
                          <p className="normal-case text-[15px]">{line.name}</p>
                        </div>
                        <VariationChips selections={line.selections} />
                        <div className="flex items-center justify-between text-[12px] uppercase">
                          <QuantityControl
                            value={line.quantity}
                            onIncrease={() => changeQuantity(line.id, line.quantity + 1)}
                            onDecrease={() => changeQuantity(line.id, line.quantity - 1)}
                          />
                          <div className="text-right text-[16px] tracking-tight normal-case">
                            {formatMoney(line.unitPrice * line.quantity)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          className="self-start text-[12px] underline underline-offset-[6px]"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 border-t border-neutral-900 pt-6 text-[15px]">
                <div className="flex items-center justify-between text-[18px] font-semibold">
                  <span>Subtotal</span>
                  <span>{formatMoney(grandTotal)}</span>
                </div>
                <p className="text-[13px] text-neutral-600">
                  Taxes and delivery are confirmed at checkout · Free click &amp; collect applies to most stores.
                </p>
                <button
                  type="button"
                  className="flex w-full items-center justify-center bg-black py-4 text-[12px] font-semibold uppercase tracking-[0.42em] text-white"
                >
                  Secure checkout
                </button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

function VariationChips({ selections }: { selections: Record<string, string> }): JSX.Element | null {
  const entries = Object.entries(selections).filter(([, value]) => Boolean(value))
  if (!entries.length) return null

  return (
    <div className="flex flex-wrap gap-3 text-[11px] uppercase">
      {entries.map(([key, val]) => (
        <Fragment key={key}>
          <span className="rounded-full border border-neutral-900 px-3 py-1">
            {key}: {val}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

type QtyProps = {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

function QuantityControl({ value, onIncrease, onDecrease }: QtyProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 border border-black px-[10px] py-[8px] text-[22px]">
      <button type="button" onClick={onDecrease} aria-label="Decrease line quantity">
        −
      </button>
      <span className="min-w-[20px] text-center text-[17px] font-semibold normal-case">{value}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase line quantity">
        +
      </button>
    </div>
  )
}
