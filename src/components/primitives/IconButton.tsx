import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, JSX } from "react";

import { cn } from "../../lib/cn";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
  {
    variants: {
      tone: {
        ghost: "text-black hover:bg-neutral-100/80",
        subtle: "text-black hover:bg-neutral-100",
        outlined: "border border-black text-black hover:bg-neutral-100",
      },
      size: {
        md: "h-10 w-10",
        lg: "h-11 w-11",
      },
      radius: {
        sm: "rounded-sm",
        full: "rounded-full",
        md: "rounded-md",
      },
    },
    defaultVariants: {
      tone: "ghost",
      size: "md",
      radius: "sm",
    },
  },
);

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants>;

export function IconButton({
  className,
  tone,
  size,
  radius,
  ...props
}: IconButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={cn(iconButtonVariants({ tone, size, radius }), className)}
    />
  );
}
