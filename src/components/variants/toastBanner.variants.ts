export const toastCardClass =
  "pointer-events-auto mx-4 flex w-[min(calc(100vw-2rem),420px)] items-center gap-4 " +
  "rounded-full border border-neutral-200/90 bg-white ps-5 pe-2 py-2.5 " +
  "shadow-[0_22px_50px_-12px_rgba(0,0,0,0.18),0_10px_30px_-10px_rgba(0,0,0,0.12)] " +
  "motion-safe:animate-toast-rise motion-reduce:animate-none";

export const toastCheckoutButtonClass =
  "relative flex h-11 w-11 items-center justify-center rounded-full bg-black text-white " +
  "transition hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-black focus-visible:ring-offset-2";

export const toastCheckoutTooltipClass =
  "pointer-events-none invisible absolute bottom-full end-0 z-10 mb-2 whitespace-nowrap " +
  "rounded-md bg-neutral-900 px-2.5 py-1.5 text-[11px] font-semibold tracking-tight text-white " +
  "shadow-lg opacity-0 transition-[opacity,visibility] duration-150 " +
  "group-hover/checkout:visible group-hover/checkout:opacity-100 " +
  "group-focus-within/checkout:visible group-focus-within/checkout:opacity-100";
