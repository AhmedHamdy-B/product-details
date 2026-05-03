import type { JSX } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Heart, X } from "lucide-react";

import { useLocale } from "../i18n/useLocale";
import { useFavoritesStore } from "../stores/favoritesStore";

export function FavoritesDrawer(): JSX.Element {
  const { t } = useLocale();
  const open = useFavoritesStore((s) => s.drawerOpen);
  const close = useFavoritesStore((s) => s.closeDrawer);
  const items = useFavoritesStore((s) => s.items);
  const removeProduct = useFavoritesStore((s) => s.removeProduct);

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-[75]">
      <DialogBackdrop transition className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 z-[80] flex justify-end rtl:justify-start">
        <DialogPanel
          transition
          className="flex h-full w-full max-w-xl flex-col gap-6 border-s border-neutral-900 bg-white px-6 py-8 shadow-2xl data-[closed]:ltr:translate-x-6 data-[closed]:rtl:-translate-x-6 data-[closed]:opacity-0"
        >
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-sans text-[22px] font-bold tracking-[-0.02em] text-black">
              {t("fav.title")}
            </DialogTitle>
            <button
              type="button"
              aria-label={t("fav.close")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black text-black transition hover:bg-neutral-100"
              onClick={close}
            >
              <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-[15px] leading-relaxed text-neutral-600">{t("fav.empty")}</p>
          ) : (
            <ul className="flex flex-1 flex-col gap-0 overflow-y-auto pe-1">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-5 border-b border-neutral-900/10 py-6 first:pt-0"
                >
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-jl-gray">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                      decoding="async"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <p className="text-[15px] font-semibold leading-snug text-neutral-950">
                      {item.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.productId)}
                      className="flex w-fit items-center gap-2 text-[13px] font-semibold text-neutral-900 underline underline-offset-[5px]"
                    >
                      <Heart
                        className="h-4 w-4 shrink-0"
                        strokeWidth={1.75}
                        fill="currentColor"
                        aria-hidden
                      />
                      {t("fav.remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
