import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  type DialogProps,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { JSX, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { IconButton } from "./IconButton";

type DrawerShellProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
  zIndexClassName?: string;
};

export function DrawerShell({
  open,
  onClose,
  title,
  closeLabel,
  className,
  panelClassName,
  children,
  zIndexClassName = "z-[80]",
}: DrawerShellProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose as DialogProps["onClose"]}
      className={cn("relative z-[70]", className)}
    >
      <DialogBackdrop transition className="fixed inset-0 bg-black/40" />
      <div className={cn("fixed inset-0 flex justify-end rtl:justify-start", zIndexClassName)}>
        <DialogPanel
          transition
          className={cn(
            "flex h-full w-full max-w-xl flex-col gap-6 border-s border-neutral-900 bg-white px-6 py-8 shadow-2xl",
            "data-[closed]:ltr:translate-x-6 data-[closed]:rtl:-translate-x-6 data-[closed]:opacity-0",
            panelClassName,
          )}
        >
          <header className="flex items-center justify-between gap-4">
            <DialogTitle className="font-serif text-[28px] font-medium">{title}</DialogTitle>
            <IconButton
              type="button"
              aria-label={closeLabel}
              tone="outlined"
              radius="full"
              onClick={onClose}
            >
              <X className="h-5 w-5" strokeWidth={1.65} aria-hidden />
            </IconButton>
          </header>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
