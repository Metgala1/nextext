"use client";

type ChatHeaderProps = {
  name: string;
  initials: string;
};

export default function ChatHeader({
  name,
  initials,
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
        <h2 className="truncate text-sm font-semibold">
          {name}
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Conversation
        </p>
      </div>
    </header>
  );
}