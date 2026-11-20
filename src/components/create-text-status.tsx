
"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { statusThemes } from "@/data/status-themes";
import type { StatusBackground } from "@/data/status";

type CreateTextStatusProps = {
  onBack: () => void;
  onPublish: (content: string, background: StatusBackground) => void;
};

export default function CreateTextStatus({
  onBack,
  onPublish,
}: CreateTextStatusProps) {
  const [content, setContent] = useState("");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  const selectedTheme = statusThemes[selectedThemeIndex];
  const characterLimit = 700;

  function handlePublish() {
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    onPublish(trimmedContent, selectedTheme);
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
              Create text status
            </h1>
            <p className="mt-0.5 text-xs text-text-secondary">
              Share what's on your mind
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={!content.trim()}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={15} />
          Publish
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-6">
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

          <span className="absolute right-4 bottom-4 text-xs opacity-70">
            {content.length}/{characterLimit}
          </span>
        </div>

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
      </div>
    </div>
  );
}
