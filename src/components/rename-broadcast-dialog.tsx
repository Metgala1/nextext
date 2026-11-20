"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type RenameBroadcastDialogProps = {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function RenameBroadcastDialog({
  isOpen,
  currentName,
  onClose,
  onSave,
}: RenameBroadcastDialogProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    onSave(trimmedName);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-broadcast-title"
        className="w-full max-w-md rounded-2xl border border-border bg-background shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="rename-broadcast-title"
            className="text-lg font-semibold text-foreground"
          >
            Rename broadcast list
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5">
          <label
            htmlFor="broadcast-name"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            List name
          </label>

          <input
            id="broadcast-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
            autoFocus
            maxLength={50}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-secondary focus:border-accent"
          />
        </div>

        <footer className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || name.trim() === currentName}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}