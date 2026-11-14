
"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

type EditGroupPhotoDialogProps = {
  onClose: () => void;
  onSave: (photo: File) => void;
};

export default function EditGroupPhotoDialog({
  onClose,
  onSave,
}: EditGroupPhotoDialogProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPhoto) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedPhoto);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedPhoto]);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedPhoto(file);
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
        aria-labelledby="edit-group-photo-title"
        className="w-full max-w-md rounded-default border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-group-photo-title"
            className="text-lg font-semibold text-foreground"
          >
            Change group photo
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

        <div className="flex flex-col items-center">
          <div className="flex size-36 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-elevated">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected group photo preview"
                className="size-full object-cover"
              />
            ) : (
              <ImagePlus size={36} className="text-text-secondary" />
            )}
          </div>

          <label className="mt-5 cursor-pointer rounded-default border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated">
            Choose photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>

          <p className="mt-3 text-xs text-text-secondary">
            JPG, PNG or other image formats. Maximum 5 MB.
          </p>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-default border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedPhoto}
            onClick={() => selectedPhoto && onSave(selectedPhoto)}
            className="rounded-default bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save photo
          </button>
        </div>
      </section>
    </div>
  );
}
