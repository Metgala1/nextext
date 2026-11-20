
"use client";

import { AlertTriangle, X } from "lucide-react";

type DeleteBroadcastDialogProps = {
  isOpen: boolean;
  broadcastName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteBroadcastDialog({
  isOpen,
  broadcastName,
  onClose,
  onConfirm,
}: DeleteBroadcastDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-broadcast-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-start justify-between p-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle size={20} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5">
          <h2
            id="delete-broadcast-title"
            className="font-semibold text-foreground"
          >
            Delete broadcast list?
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {broadcastName}
            </span>
            ? Its broadcast history will be removed. Messages already
            delivered to individual conversations will remain.
          </p>
        </div>

        <div className="flex justify-end gap-3 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete list
          </button>
        </div>
      </div>
    </div>
  );
}
