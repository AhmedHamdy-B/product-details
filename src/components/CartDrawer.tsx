import { Fragment, type JSX } from "react";

import { useLocale } from "../i18n/useLocale";
import { formatMoney } from "../lib/money";
import { useCartStore } from "../stores/cartStore";
import { selectCartTotal } from "../stores/selectors";
import { useShallow } from "zustand/react/shallow";
import { DrawerShell } from "./primitives/DrawerShell";
import { Button } from "./ui/Button";

export function CartDrawer(): JSX.Element {
  const { t } = useLocale();
  const { open, close, lines, changeQuantity, remove } = useCartStore(
    useShallow((state) => ({
      open: state.drawerOpen,
      close: state.closeDrawer,
      lines: state.lines,
      changeQuantity: state.setQuantity,
      remove: state.removeLine,
    })),
  );

  const grandTotal = useCartStore(selectCartTotal);

  return (
    <DrawerShell
      open={open}
      onClose={close}
      title={t("cart.title")}
      closeLabel={t("cart.close")}
    >
      {lines.length === 0 ? (
        <p className="text-[15px] text-neutral-600">{t("cart.empty")}</p>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pe-1">
            <ul className="space-y-5">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-5 border-b border-neutral-900/10 pb-6"
                >
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-24 w-24 border border-neutral-900/10 bg-jl-gray object-cover"
                  />

                  <div className="flex flex-1 flex-col gap-4 text-[13px] font-semibold uppercase tracking-[0.35em]">
                    <div>
                      <p className="normal-case text-neutral-600">{t("brand.anyday")}</p>
                      <p className="normal-case text-[15px]">{line.name}</p>
                    </div>
                    <VariationChips selections={line.selections} />
                    <div className="flex items-center justify-between text-[12px] uppercase">
                      <QuantityControl
                        value={line.quantity}
                        onIncrease={() => changeQuantity(line.id, line.quantity + 1)}
                        onDecrease={() => changeQuantity(line.id, line.quantity - 1)}
                      />
                      <div className="text-end text-[16px] tracking-tight normal-case">
                        {formatMoney(line.unitPrice * line.quantity)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="self-start text-[12px] underline underline-offset-[6px]"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 border-t border-neutral-900 pt-6 text-[15px]">
            <div className="flex items-center justify-between text-[18px] font-semibold">
              <span>{t("cart.subtotal")}</span>
              <span>{formatMoney(grandTotal)}</span>
            </div>
            <p className="text-[13px] text-neutral-600">{t("cart.checkoutNote")}</p>
            <Button type="button" className="w-full justify-center rounded-none py-4">
              {t("cart.checkoutButton")}
            </Button>
          </div>
        </>
      )}
    </DrawerShell>
  );
}

function VariationChips({
  selections,
}: {
  selections: Record<string, string>;
}): JSX.Element | null {
  const entries = Object.entries(selections).filter(([, value]) =>
    Boolean(value),
  );
  if (!entries.length) return null;

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
  );
}

type QtyProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

function QuantityControl({
  value,
  onIncrease,
  onDecrease,
}: QtyProps): JSX.Element {
  const { t } = useLocale();
  return (
    <div className="flex items-center gap-3 border border-black px-[10px] py-[8px] text-[22px]">
      <button
        type="button"
        onClick={onDecrease}
        aria-label={t("cart.decLineQty")}
      >
        −
      </button>
      <span className="min-w-[20px] text-center text-[17px] font-semibold normal-case">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={t("cart.incLineQty")}
      >
        +
      </button>
    </div>
  );
}
