import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import { FormEvent, useEffect, useId, useState, type JSX } from "react";
import { useShallow } from "zustand/react/shallow";

import { useLocale } from "../i18n/useLocale";
import { cn } from "../lib/cn";
import { formatMoney } from "../lib/money";
import { useCartStore } from "../stores/cartStore";
import { selectCartTotal } from "../stores/selectors";
import { Button } from "./ui/Button";
import {
  checkoutBackdropClass,
  checkoutFieldInputClass,
  checkoutFieldLabelClass,
  checkoutLineRowClass,
  checkoutPanelClass,
} from "./variants/checkoutModal.variants";

function shortOrderRef(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8).toUpperCase();
  }
  return `${Date.now().toString(36)}`.slice(-8).toUpperCase();
}

export function CheckoutModal(): JSX.Element | null {
  const { t } = useLocale();
  const disclaimerId = useId();

  const {
    checkoutOpen,
    lines,
    closeCheckout,
    openDrawer,
    clear,
  } = useCartStore(
    useShallow((s) => ({
      checkoutOpen: s.checkoutOpen,
      lines: s.lines,
      closeCheckout: s.closeCheckout,
      openDrawer: s.openDrawer,
      clear: s.clear,
    })),
  );
  const grandTotal = useCartStore(selectCartTotal);

  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    if (!checkoutOpen) {
      setSuccess(false);
      setOrderRef("");
    }
  }, [checkoutOpen]);

  const handleDialogClose = () => {
    if (success) clear();
    closeCheckout();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setOrderRef(shortOrderRef());
    setSuccess(true);
  };

  const handleEmptyViewBasket = () => {
    closeCheckout();
    openDrawer();
  };

  return (
    <Dialog
      open={checkoutOpen}
      onClose={handleDialogClose}
      className="relative z-[400]"
    >
      {/* isolate: backdrop + panel share one stacking context so dimming never paints over the sheet */}
      <div className="fixed inset-0 z-[400] isolate flex items-end justify-center sm:items-center sm:p-4">
        <DialogBackdrop transition className={checkoutBackdropClass} />
        <DialogPanel
          transition
          className={checkoutPanelClass}
          aria-describedby={success ? undefined : disclaimerId}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-200 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <DialogTitle className="font-sans text-[20px] font-semibold tracking-tight text-neutral-950 sm:text-[22px]">
                {success ? t("checkout.successTitle") : t("checkout.title")}
              </DialogTitle>
              {!success ? (
                <p
                  id={disclaimerId}
                  className="mt-1 text-[12px] leading-snug text-neutral-500"
                >
                  {t("checkout.demoDisclaimer")}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                "border border-neutral-200 text-neutral-800 transition hover:bg-neutral-50",
              )}
              onClick={handleDialogClose}
              aria-label={t("checkout.closeAria")}
            >
              <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            {lines.length === 0 && !success ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <p className="font-sans text-[18px] font-semibold text-neutral-950">
                  {t("checkout.emptyTitle")}
                </p>
                <p className="max-w-[280px] text-[14px] text-neutral-600">
                  {t("checkout.emptyBody")}
                </p>
                <Button
                  type="button"
                  intent="secondary"
                  size="md"
                  className="w-full max-w-xs justify-center rounded-lg"
                  onClick={handleEmptyViewBasket}
                >
                  {t("checkout.backToBasket")}
                </Button>
              </div>
            ) : null}

            {success ? (
              <div className="space-y-5 py-2">
                <p className="text-[15px] leading-relaxed text-neutral-700">
                  {t("checkout.successBody")}
                </p>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    {t("checkout.orderRef")}
                  </p>
                  <p className="mt-1 font-mono text-[18px] font-semibold tabular-nums text-neutral-950">
                    {orderRef}
                  </p>
                </div>
                <Button
                  type="button"
                  className="w-full justify-center rounded-lg py-4"
                  onClick={handleDialogClose}
                >
                  {t("checkout.done")}
                </Button>
              </div>
            ) : null}

            {!success && lines.length > 0 ? (
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <section aria-labelledby="checkout-summary-heading">
                  <h2
                    id="checkout-summary-heading"
                    className="text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-600"
                  >
                    {t("checkout.summaryHeading")}
                  </h2>
                  <ul className="mt-3">
                    {lines.map((line) => (
                      <li key={line.id} className={checkoutLineRowClass}>
                        <img
                          src={line.image}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-md border border-neutral-200 bg-jl-gray object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold leading-snug text-neutral-950">
                            {line.name}
                          </p>
                          <p className="mt-0.5 text-[12px] text-neutral-500">
                            {t("pdp.quantity")}: {line.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 text-[14px] font-semibold tabular-nums text-neutral-950">
                          {formatMoney(line.unitPrice * line.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-[16px] font-semibold">
                    <span>{t("cart.subtotal")}</span>
                    <span>{formatMoney(grandTotal)}</span>
                  </div>
                </section>

                <section aria-labelledby="checkout-contact-heading">
                  <h2
                    id="checkout-contact-heading"
                    className="text-[12px] font-semibold uppercase tracking-[0.16em] text-neutral-600"
                  >
                    {t("checkout.contactHeading")}
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={checkoutFieldLabelClass} htmlFor="co-name">
                        {t("checkout.labelFullName")}
                      </label>
                      <input
                        id="co-name"
                        name="fullName"
                        required
                        autoComplete="name"
                        className={checkoutFieldInputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={checkoutFieldLabelClass} htmlFor="co-email">
                        {t("checkout.labelEmail")}
                      </label>
                      <input
                        id="co-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className={checkoutFieldInputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={checkoutFieldLabelClass} htmlFor="co-addr">
                        {t("checkout.labelAddress")}
                      </label>
                      <input
                        id="co-addr"
                        name="address"
                        required
                        autoComplete="street-address"
                        className={checkoutFieldInputClass}
                      />
                    </div>
                    <div>
                      <label className={checkoutFieldLabelClass} htmlFor="co-city">
                        {t("checkout.labelCity")}
                      </label>
                      <input
                        id="co-city"
                        name="city"
                        required
                        autoComplete="address-level2"
                        className={checkoutFieldInputClass}
                      />
                    </div>
                    <div>
                      <label className={checkoutFieldLabelClass} htmlFor="co-post">
                        {t("checkout.labelPostcode")}
                      </label>
                      <input
                        id="co-post"
                        name="postcode"
                        required
                        autoComplete="postal-code"
                        className={checkoutFieldInputClass}
                      />
                    </div>
                  </div>
                </section>

                <Button type="submit" className="w-full justify-center rounded-lg py-4">
                  {t("checkout.placeOrder")}{" "}
                  <span className="tabular-nums">({formatMoney(grandTotal)})</span>
                </Button>
              </form>
            ) : null}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
