import { cva } from "class-variance-authority";

export const goToTopButtonClass = cva(
  [
    "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))]",
    "end-[max(1.25rem,env(safe-area-inset-right,0px))] z-[45]",
    "md:bottom-8 md:end-8",
    "inline-flex size-12 shrink-0 items-center justify-center",
    "rounded-[10px] border border-[#E0E0E0] bg-jl-white",
    "text-jl-black shadow-card",
    "transition-[background-color,border-color,opacity,transform] duration-200",
    "motion-reduce:transition-colors motion-reduce:duration-0",
    "hover:border-[#BDBDBD] hover:bg-jl-gray",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-jl-white",
  ],
  {
    variants: {
      visible: {
        true: "pointer-events-auto translate-y-0 opacity-100 active:translate-y-px",
        false:
          "pointer-events-none translate-y-2 opacity-0 motion-reduce:translate-y-0",
      },
    },
    defaultVariants: {
      visible: false,
    },
  },
);
