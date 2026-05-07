import { cva } from "class-variance-authority";

export const relatedRailIcon = "h-[18px] w-[18px]";

export const relatedRailBtn =
  "pointer-events-auto relative z-[12] inline-flex h-[35px] w-[35px] shrink-0 " +
  "cursor-pointer items-center justify-center rounded-md border border-black/18 " +
  "bg-[#f1f0ea] text-black shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition " +
  "hover:bg-[#e6e5dd] active:scale-[0.97] focus:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-black focus-visible:ring-offset-1";

export const relatedTooltipBase =
  "pointer-events-none invisible absolute bottom-full end-0 z-[25] mb-2 " +
  "whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-semibold " +
  "tracking-tight text-white shadow-lg opacity-0 transition-[opacity,visibility] " +
  "duration-150 motion-reduce:transition-none";

export const relatedRailGridClass = cva("", {
  variants: {
    variant: {
      related:
        "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-[18px] xl:gap-9",
      default:
        "grid grid-cols-2 gap-[18px] sm:gap-8 md:flex md:flex-nowrap md:gap-10 " +
        "md:overflow-x-auto md:no-scrollbar md:scroll-smooth lg:justify-between " +
        "xl:justify-start",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const relatedTrayVisibilityClass =
  "pointer-events-none absolute inset-0 z-10 hidden flex-col items-end justify-start p-2 " +
  "md:flex " +
  "md:invisible md:opacity-0 md:motion-safe:transition-[opacity,visibility] " +
  "md:motion-safe:duration-200 md:motion-safe:ease-out " +
  "md:group-hover/related:visible md:group-hover/related:opacity-100 " +
  "md:group-focus-within/related:visible md:group-focus-within/related:opacity-100";

export const relatedViewAllLinkClass =
  "text-[16px] font-medium text-[#525252] underline decoration-black " +
  "underline-offset-[3px] transition hover:text-neutral-700 hover:decoration-neutral-700";
