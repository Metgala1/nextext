"use client";

type ReactionPickerProps = {
  onSelect: (emoji: string) => void;
};

const emojis = ["❤️", "😂", "👍", "🔥", "😮", "👏", "😢", "🙏"];

export default function ReactionPicker({
  onSelect,
}: ReactionPickerProps) {
  return (
    <div
      role="group"
      aria-label="Choose a reaction"
      className="flex items-center gap-1 rounded-default border border-border bg-surface p-2 shadow-xl"
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          aria-label={`React with ${emoji}`}
          onClick={() => onSelect(emoji)}
          className="flex size-9 items-center justify-center rounded-md text-xl transition-transform hover:scale-125 hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-accent"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}