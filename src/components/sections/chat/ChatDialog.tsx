"use client";

import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimal dialog built on Radix, styled to the black / white / blue-600 system.
 *
 * Hand-rolled rather than scaffolded because the project only needs this one
 * shape, and Radix already handles what actually matters: focus trapping, restore
 * on close, Escape, scroll lock, and the `aria-modal` wiring.
 */
export default function ChatDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-md",
            "-translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden",
            "rounded-2xl border border-neutral-200 bg-white shadow-2xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            className,
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-base font-bold tracking-tight text-neutral-950">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-xs leading-relaxed text-neutral-500">
                  {description}
                </Dialog.Description>
              )}
            </div>

            <Dialog.Close
              aria-label="Close"
              className="-mt-1 -mr-1 shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X className="size-4" />
            </Dialog.Close>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

          {footer && (
            <footer className="border-t border-neutral-200 px-5 py-3.5">
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
