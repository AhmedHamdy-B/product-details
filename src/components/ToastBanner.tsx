import { CircleCheck, CreditCard } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useLocale } from "../i18n/useLocale";
import { useCartStore } from "../stores/cartStore";
import { selectCartItemsCount } from "../stores/selectors";
import { cn } from "../lib/cn";
import {
  toastCardClass,
  toastCheckoutButtonClass,
  toastCheckoutTooltipClass,
} from "./variants/toastBanner.variants";

export function ToastBanner() {
  const { t, tf } = useLocale();
  const { toast, dismiss, openDrawer, itemCount } = useCartStore(
    useShallow((state) => ({
      toast: state.toast,
      dismiss: state.dismissToast,
      openDrawer: state.openDrawer,
      itemCount: selectCartItemsCount(state),
    })),
  );

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => dismiss(), 4400);
    return () => window.clearTimeout(id);
  }, [toast, dismiss]);

  if (!toast) return null;

  const toastLine = toast === "item_added" ? t("toast.addedTitle") : null;
  const itemsLabel =
    itemCount === 1
      ? tf("toast.oneItemBasket", { count: itemCount })
      : tf("toast.multiItemsBasket", { count: itemCount });

  const handleCheckout = () => {
    dismiss();
    openDrawer();
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[100]",
        "flex justify-center pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-10",
      )}
      aria-live="polite"
    >
      <div
        className={toastCardClass}
      >
        <CircleCheck
          className="h-[22px] w-[22px] shrink-0 text-emerald-600"
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0 flex-1 pe-2">
          <p className="text-[14px] font-semibold leading-tight tracking-[-0.01em] text-neutral-950">
            {toastLine}
          </p>
          <p className="mt-0.5 text-[12px] font-medium leading-tight text-neutral-500">
            {itemsLabel}
          </p>
        </div>

        <div className="group/checkout relative shrink-0">
          <button
            type="button"
            onClick={handleCheckout}
            className={toastCheckoutButtonClass}
            aria-describedby="toast-checkout-tip"
          >
            <CreditCard
              className="h-[20px] w-[20px]"
              strokeWidth={2}
              aria-hidden
            />
          </button>
          <span
            id="toast-checkout-tip"
            role="tooltip"
            className={toastCheckoutTooltipClass}
          >
            {t("toast.checkoutShortcut")}
          </span>
        </div>
      </div>
    </div>
  );
}
