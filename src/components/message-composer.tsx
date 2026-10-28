import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Mic,
} from "lucide-react";

export default function MessageComposer() {
  return (
    <form
      className="flex shrink-0 items-end gap-2 border-t border-border p-3"
      onSubmit={(event) => event.preventDefault()}
    >
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
      type="text"
      placeholder="Write a message..."
      className="w-full min-w-0 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-text-secondary"
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
  className="flex size-12 shrink-0 items-center justify-center rounded-default bg-accent text-white transition-opacity hover:opacity-90"
>
  <Send size={18} aria-hidden="true" />
</button>
    </form>
  );
}