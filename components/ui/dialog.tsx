"use client";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { Fragment, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  if (!open) return null;

  return (
    <Fragment>
      <div
        className={cn("fixed inset-0 z-50 bg-black/50", "transition-opacity")}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="text-sm text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </Fragment>
  );
}

interface DialogHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function DialogHeader({ title, description, className }: DialogHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
  );
}

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100", className)}>
      {children}
    </div>
  );
}

export function DialogTrigger({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <>{children}</>;
}