"use client";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal dialog that never outgrows the screen: the panel is capped at the
 * viewport height and its body scrolls, while the title bar stays on top and
 * a DialogFooter (if used) sticks to the bottom so Save is always reachable.
 * On phones it opens as a full-width bottom sheet.
 */
export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    // Lock page scroll behind the dialog; restore on close.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChangeRef.current(false);
    };
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative flex w-full max-w-2xl flex-col bg-white shadow-xl outline-none",
          "max-h-[92dvh] rounded-t-2xl sm:max-h-[90dvh] sm:rounded-xl",
          className
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="-mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 sm:px-6 [&>*:last-child:not(form)]:pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

/**
 * Kept for compatibility with existing forms. The Dialog already renders the
 * title and description in its fixed title bar, so this renders nothing
 * (it previously showed the same title a second time).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DialogHeader(_props: DialogHeaderProps) {
  return null;
}

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

/** Sticks to the bottom of the dialog so the action buttons stay visible while the form scrolls. */
export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-5 mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogTrigger({ children }: { children: ReactNode; onClick: () => void }) {
  return <>{children}</>;
}
