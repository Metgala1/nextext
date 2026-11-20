
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  ImagePlus,
  X,
} from "lucide-react";
import { statusThemes } from "@/data/status-themes";
import type { StatusBackground } from "@/data/status";

type CreateTextStatusProps = {
  onBack: () => void;
  onPublish: (
  content: string,
  background: StatusBackground,
  media: File | null
) => void;
};

export default function CreateTextStatus({
  onBack,
  onPublish,
}: CreateTextStatusProps) {
  const [content, setContent] = useState("");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTheme = statusThemes[selectedThemeIndex];
  const characterLimit = 700;

  useEffect(() => {
    if (!selectedMedia) {
      setMediaPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedMedia);
    setMediaPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedMedia]);

function handlePublish() {
  const trimmedContent = content.trim();

  if (!trimmedContent && !selectedMedia) return;

  onPublish(trimmedContent, selectedTheme, selectedMedia);
}

  function handleMediaSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      event.target.value = "";
      return;
    }

    setSelectedMedia(file);
  }

  function handleRemoveMedia() {
    setSelectedMedia(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-base font-semibold text-foreground">
              Create status
            </h1>
            <p className="mt-0.5 text-xs text-text-secondary">
              Share what's on your mind
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={!content.trim() && !selectedMedia}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={15} />
          Publish
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaSelect}
          className="hidden"
        />

        {!selectedMedia ? (
          <div
            className="relative flex min-h-[320px] w-full max-w-md flex-1 items-center justify-center rounded-2xl p-8 shadow-lg"
            style={{
              backgroundColor: selectedTheme.background,
              color: selectedTheme.foreground,
            }}
          >
            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value.slice(0, characterLimit))
              }
              maxLength={characterLimit}
              placeholder="Type a status update..."
              aria-label="Status text"
              autoFocus
              className="w-full resize-none bg-transparent text-center text-2xl font-semibold leading-relaxed outline-none placeholder:opacity-50"
              rows={5}
            />

            <span className="absolute bottom-4 right-4 text-xs opacity-70">
              {content.length}/{characterLimit}
            </span>
          </div>
        ) : (
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-black">
            {mediaPreviewUrl &&
              (selectedMedia.type.startsWith("image/") ? (
                <img
                  src={mediaPreviewUrl}
                  alt="Selected status preview"
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <video
                  src={mediaPreviewUrl}
                  controls
                  playsInline
                  className="max-h-[420px] w-full"
                />
              ))}

            <button
              type="button"
              onClick={handleRemoveMedia}
              aria-label="Remove selected media"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {selectedMedia && (
          <div className="w-full max-w-md">
            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value.slice(0, characterLimit))
              }
              maxLength={characterLimit}
              placeholder="Add a caption..."
              aria-label="Media status caption"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-foreground outline-none placeholder:text-text-secondary focus:border-accent"
            />

            <p className="mt-1 text-right text-xs text-text-secondary">
              {content.length}/{characterLimit}
            </p>
          </div>
        )}

        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-4 text-sm text-foreground transition hover:border-accent hover:bg-surface-elevated"
          >
            <ImagePlus size={20} className="text-accent" />
            {selectedMedia ? "Change photo or video" : "Add a photo or video"}
          </button>
        </div>

        {!selectedMedia && (
          <div className="w-full max-w-md">
            <p className="mb-3 text-sm font-medium text-foreground">
              Background
            </p>

            <div className="flex flex-wrap gap-3">
              {statusThemes.map((theme, index) => (
                <button
                  key={theme.background}
                  type="button"
                  onClick={() => setSelectedThemeIndex(index)}
                  aria-label={`Select background ${index + 1}`}
                  aria-pressed={selectedThemeIndex === index}
                  className={`size-9 rounded-full border-2 transition-transform ${
                    selectedThemeIndex === index
                      ? "scale-110 border-foreground"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: theme.background }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
