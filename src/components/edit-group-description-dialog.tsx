
"use client";

import { useState } from "react";
import { X } from "lucide-react";

type EditGroupDescriptionDialogProps = {
  initialDescription?: string;
  onClose: () => void;
  onSave: (description: string) => void;
};

export default function EditGroupDescriptionDialog({
  initialDescription = "",
  onClose,
  onSave,
}: EditGroupDescriptionDialogProps) {
  const [description, setDescription] = useState(initialDescription);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(description.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-description-title"
        className="w-full max-w-md rounded-default border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="edit-description-title"
            className="text-lg font-semibold text-foreground"
          >
            Edit group description
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-9 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="group-description"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Description
          </label>

          <textarea
            id="group-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={200}
            rows={4}
            placeholder="What is this group about?"
            className="w-full resize-none rounded-default border border-border bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-secondary focus:border-accent"
          />

          <p className="mt-2 text-right text-xs text-text-secondary">
            {description.length}/200
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-default border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={description.trim().length === 0}
              className="rounded-default bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save description
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
