"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type BroadcastComposerProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export default function BroadcastComposer({
  disabled = false,
  onSend,
}: BroadcastComposerProps) {
  const [message, setMessage] = useState("");

  function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage("");
  }

  return (
    <div className="shrink-0 border-t border-border bg-background p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a broadcast message..."
          rows={1}
          disabled={disabled}
          className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-secondary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          aria-label="Send broadcast message"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-3xl text-xs text-text-secondary">
        Press Enter to send. Shift + Enter for a new line.
      </p>
    </div>
  );
}