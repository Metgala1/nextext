import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Mic,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Message } from "@/data/messages";

type MessageComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  contactName: string
};

export default function MessageComposer({
  onSend,
  disabled = false,
  onCancelReply,
  replyingTo,
  contactName
}: MessageComposerProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Jump straight to typing when a reply is started.
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  function handleSend() {
    const trimmedText = draft.trim();
    if (!trimmedText || disabled) return;

    onSend(trimmedText);
    setDraft("");
  }

  return (
    <form
      className="flex shrink-0 flex-col gap-2 border-t border-border p-3"
      onSubmit={(event) => event.preventDefault()}
    >
      {/* Reply preview sits above the input row, not inside the label */}
      {replyingTo && (
        <div className="flex items-center gap-3 rounded-default border border-border bg-surface-elevated p-3">
          <div className="h-10 w-1 shrink-0 rounded-full bg-accent" />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-accent">
              Replying to {replyingTo.sender === "me" ? "yourself" : contactName}
            </p>

            <p className="truncate text-sm text-text-secondary">
              {replyingTo.text}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex min-w-0 flex-1 items-end gap-2">
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              aria-label="Attach a file"
              className="flex size-9 shrink-0 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              <Paperclip size={19} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Add an image"
              className="flex size-9 shrink-0 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              <ImageIcon size={19} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Add an emoji"
              className="flex size-9 shrink-0 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              <Smile size={19} strokeWidth={1.8} />
            </button>
          </div>

          <label className="flex min-h-12 min-w-0 flex-1 items-center rounded-default border border-border bg-surface px-4 focus-within:border-accent">
            <span className="sr-only">Write a message</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Write a message..."
              className="w-full min-w-0 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-text-secondary"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={disabled}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
            />
          </label>

          <button
            type="button"
            aria-label="Record a voice message"
            className="mb-1 flex size-9 shrink-0 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <Mic size={19} strokeWidth={1.8} />
          </button>
        </div>

        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled}
          className="flex size-12 shrink-0 items-center justify-center rounded-default bg-accent text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSend}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}