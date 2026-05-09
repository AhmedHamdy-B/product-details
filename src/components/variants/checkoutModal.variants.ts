/** Layout + surface tokens for generic checkout dialog (mobile-first sheet, desktop card). */
// Backdrop sits under the panel in the same fixed wrapper (`absolute` + `z-0` avoids covering the modal).
export const checkoutBackdropClass =
  "absolute inset-0 z-0 bg-black/45 data-[closed]:opacity-0 transition duration-200 ease-out";

export const checkoutPanelClass =
  "relative z-10 flex max-h-[min(92dvh,900px)] w-full max-w-[min(100%,480px)] flex-col overflow-hidden rounded-t-2xl " +
  "border border-neutral-200 bg-white shadow-2xl outline-none " +
  "data-[closed]:translate-y-6 data-[closed]:opacity-0 sm:max-h-[85vh] sm:rounded-2xl " +
  "sm:data-[closed]:translate-y-4 transition duration-200 ease-out";

export const checkoutFieldLabelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600";

export const checkoutFieldInputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-[15px] text-neutral-950 " +
  "shadow-inner outline-none transition placeholder:text-neutral-400 " +
  "focus:border-black focus:ring-1 focus:ring-black";

export const checkoutLineRowClass =
  "flex gap-3 border-b border-neutral-100 py-3 last:border-0 last:pb-0";
