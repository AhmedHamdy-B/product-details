import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, JSX } from "react";

import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      intent: {
        primary: "bg-black text-white hover:bg-neutral-900",
        secondary:
          "border border-[#BBBBBB] bg-white text-black hover:border-[#B0B0B0]",
      },
      size: {
        md: "min-h-[60px] px-5 text-[20px] leading-tight",
        sm: "px-16 py-4 text-[12px] font-semibold uppercase tracking-[0.43em]",
      },
      weight: {
        medium: "font-medium",
        semibold: "font-semibold",
      },
      rounded: {
        md: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      weight: "semibold",
      rounded: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  intent,
  size,
  weight,
  rounded,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ intent, size, weight, rounded }),
        className,
      )}
    />
  );
}
