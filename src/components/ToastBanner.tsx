import { CircleCheck, CreditCard } from 'lucide-react'
import { useEffect } from 'react'

import { useCartStore } from '../stores/cartStore'
import { cn } from '../lib/cn'

export function ToastBanner() {
  const toast = useCartStore((state) => state.toast)
  const dismiss = useCartStore((state) => state.dismissToast)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const itemCount = useCartStore((state) => state.getUniqueCount())

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => dismiss(), 4400)
    return () => window.clearTimeout(id)
  }, [toast, dismiss])

  if (!toast) return null

  const itemsLabel =
    itemCount === 1 ? `${itemCount} item in your basket` : `${itemCount} items in your basket`

  const handleCheckout = () => {
    dismiss()
    openDrawer()
  }

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-[100]',
        'flex justify-center pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-10',
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          'pointer-events-auto mx-4 flex w-[min(calc(100vw-2rem),420px)] items-center gap-4',
          'rounded-full border border-neutral-200/90 bg-white pl-5 pr-2 py-2.5 shadow-[0_22px_50px_-12px_rgba(0,0,0,0.18),0_10px_30px_-10px_rgba(0,0,0,0.12)]',
          'motion-safe:animate-toast-rise motion-reduce:animate-none',
        )}
      >
        <CircleCheck
          className="h-[22px] w-[22px] shrink-0 text-emerald-600"
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-[14px] font-semibold leading-tight tracking-[-0.01em] text-neutral-950">
            {toast}
          </p>
          <p className="mt-0.5 text-[12px] font-medium leading-tight text-neutral-500">{itemsLabel}</p>
        </div>

        <div className="group/checkout relative shrink-0">
          <button
            type="button"
            onClick={handleCheckout}
            className={cn(
              'relative flex h-11 w-11 items-center justify-center rounded-full bg-black text-white',
              'transition hover:bg-neutral-900',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
            )}
            aria-describedby="toast-checkout-tip"
          >
            <CreditCard className="h-[20px] w-[20px]" strokeWidth={2} aria-hidden />
          </button>
          <span
            id="toast-checkout-tip"
            role="tooltip"
            className={cn(
              'pointer-events-none invisible absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap',
              'rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] font-semibold tracking-tight text-white',
              'shadow-lg opacity-0 transition-[opacity,visibility] duration-150',
              'group-hover/checkout:visible group-hover/checkout:opacity-100',
              'group-focus-within/checkout:visible group-focus-within/checkout:opacity-100',
            )}
          >
            Checkout Now
          </span>
        </div>
      </div>
    </div>
  )
}
