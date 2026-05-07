import type { JSX } from "react";
import { Heart } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useLocale } from "../i18n/useLocale";
import { useFavoritesStore } from "../stores/favoritesStore";
import { DrawerShell } from "./primitives/DrawerShell";
import { removeFavoriteButtonClass } from "./variants/favoritesDrawer.variants";

export function FavoritesDrawer(): JSX.Element {
  const { t } = useLocale();
  const { open, close, items, removeProduct } = useFavoritesStore(
    useShallow((state) => ({
      open: state.drawerOpen,
      close: state.closeDrawer,
      items: state.items,
      removeProduct: state.removeProduct,
    })),
  );

  return (
    <DrawerShell
      open={open}
      onClose={close}
      title={t("fav.title")}
      closeLabel={t("fav.close")}
      className="z-[75]"
    >
      {items.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-neutral-600">{t("fav.empty")}</p>
      ) : (
        <ul className="flex flex-1 flex-col gap-0 overflow-y-auto pe-1">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-5 border-b border-neutral-900/10 py-6 first:pt-0"
            >
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-jl-gray">
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
                  className={removeFavoriteButtonClass}
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
    </DrawerShell>
  );
}
