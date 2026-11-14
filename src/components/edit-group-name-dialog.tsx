"use client";

import { useEffect, useState } from "react";

type EditGroupNameDialogProps = {
  isOpen: boolean;
  initialName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

export default function EditGroupNameDialog({
  isOpen,
  initialName,
  onSave,
  onClose,
}: EditGroupNameDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    onSave(trimmedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            Edit group name
          </h2>

          <p className="mt-1 text-sm text-secondary">
            Choose a name that represents your group.
          </p>
        </div>

        <input
          autoFocus
          type="text"
          value={name}
          maxLength={50}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSave();
            }

            if (event.key === "Escape") {
              onClose();
            }
          }}
          placeholder="Enter group name"
          className="w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || name.trim() === initialName.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}