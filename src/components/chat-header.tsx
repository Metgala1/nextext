"use client";

type ChatHeaderProps = {
  name: string;
  initials: string;
  onNameClick: () => void
};

export default function ChatHeader({
  name,
  initials,
  onNameClick
}: ChatHeaderProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-border px-6">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent"
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="min-w-0">
        <button
            type="button"
            onClick={onNameClick}
            className="truncate text-left text-sm font-semibold transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
            {name}
        </button>

        <p className="mt-1 text-xs text-text-secondary">
          Conversation
        </p>
      </div>
    </header>
  );
}