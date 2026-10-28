
"use client";

import {
  Phone,
  Video,
  EllipsisVertical,
} from "lucide-react";

type ChatHeaderProps = {
  name: string;
  initials: string;
  onNameClick: () => void;
  isOnline: boolean;
  lastSeen: string | null;
};

export default function ChatHeader({
  name,
  initials,
  onNameClick,
  isOnline,
  lastSeen,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-border px-6">
      {/* Contact avatar */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent"
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Contact name and presence status */}
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onNameClick}
          className="block truncate text-left text-sm font-semibold transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {name}
        </button>

        {isOnline ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-green-500">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-green-500"
            />
            Online
          </p>
        ) : (
          <p className="mt-1 truncate text-xs text-text-secondary">
            {lastSeen
              ? `Last seen ${lastSeen}`
              : "Offline"}
          </p>
        )}
      </div>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Start voice call"
          title="Voice call"
          className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Phone size={19} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Start video call"
          title="Video call"
          className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Video size={20} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="More conversation options"
          title="More options"
          className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <EllipsisVertical size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
