"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Keep the latest onCancel without re-running the focus effect when the
  // parent passes a new function on every render.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable?.[0];
      const last = focusable?.[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Must come after all hooks.
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        tabIndex={-1}
        className="w-full max-w-md rounded-default border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div
            className={`flex size-11 items-center justify-center rounded-full ${
              destructive
                ? "bg-red-500/10 text-red-500"
                : "bg-surface-elevated text-foreground"
            }`}
          >
            <AlertTriangle size={21} aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="flex size-9 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <h2 id="confirmation-title" className="text-lg font-semibold">
          {title}
        </h2>

        <p
          id="confirmation-description"
          className="mt-2 text-sm leading-6 text-text-secondary"
        >
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            ref={cancelButtonRef}
            onClick={onCancel}
            className="rounded-default border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-default px-4 py-2.5 text-sm font-medium text-white transition-colors ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-accent hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}