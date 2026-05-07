import { cva } from "class-variance-authority";

export const swatchCellClass =
  "flex h-[40px] min-h-[40px] w-[75px] min-w-[75px] shrink-0 items-center justify-center";

export const sizeOptionButtonVariants = cva(
  "inline-flex h-[40px] min-h-[40px] w-[75px] min-w-[75px] shrink-0 items-center " +
    "justify-center rounded-[8px] px-0 text-[20px] font-semibold tabular-nums " +
    "tracking-tight transition outline-none focus-visible:ring-2 " +
    "focus-visible:ring-black focus-visible:ring-offset-2",
  {
    variants: {
      selected: {
        true: "border-2 border-black bg-jl-gray text-black",
        false: "border border-[#BBBBBB] bg-white text-black hover:border-[#B0B0B0]",
      },
      available: {
        true: "",
        false: "cursor-not-allowed opacity-35",
      },
    },
    defaultVariants: {
      selected: false,
      available: true,
    },
  },
);

export const descriptionVariants = cva(
  "prose prose-neutral max-w-none text-[16px] leading-[1.65] text-[#8F8F8F]",
  {
    variants: {
      expanded: {
        true: "",
        false: "line-clamp-4",
      },
    },
    defaultVariants: {
      expanded: false,
    },
  },
);

export const seeMoreButtonClass =
  "inline-flex text-[16px] font-medium leading-[1.5ch] tracking-[0] text-black " +
  "underline decoration-black underline-offset-2 hover:text-neutral-800";

export const pdpPopoverPanelClass =
  "relative overflow-hidden rounded-md border border-neutral-200/95 bg-white px-4 py-3.5 " +
  "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.2),0_8px_24px_-8px_rgba(0,0,0,0.1)]";

export const tooltipRevealTailVariants = cva("", {
  variants: {
    scope: {
      default:
        "group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 " +
        "group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto " +
        "group-focus-within:visible group-focus-within:translate-y-0 " +
        "group-focus-within:scale-100 group-focus-within:opacity-100",
      sizeguide:
        "group-hover/sizeguide:pointer-events-auto group-hover/sizeguide:visible " +
        "group-hover/sizeguide:translate-y-0 group-hover/sizeguide:scale-100 " +
        "group-hover/sizeguide:opacity-100 group-focus-within/sizeguide:pointer-events-auto " +
        "group-focus-within/sizeguide:visible group-focus-within/sizeguide:translate-y-0 " +
        "group-focus-within/sizeguide:scale-100 group-focus-within/sizeguide:opacity-100",
    },
  },
  defaultVariants: {
    scope: "default",
  },
});

export const sizeGuideButtonClass =
  "bg-transparent px-0 py-0 text-end font-sans text-[16px] font-normal tracking-normal text-black " +
  "underline decoration-black decoration-1 underline-offset-[2px] transition " +
  "hover:text-neutral-700 hover:decoration-neutral-700 focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

export const deliveryButtonClass =
  "bg-transparent px-0 py-0 text-start font-sans text-[16px] font-medium leading-snug " +
  "tracking-normal text-[#7A7A7A] underline decoration-[#7A7A7A] decoration-1 " +
  "underline-offset-[3px] transition hover:text-[#555555] hover:decoration-[#555555] " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";
