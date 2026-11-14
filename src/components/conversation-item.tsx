"use client";

type ConversationItemProps = {
  name: string;
  lastMessage: string;
  timestamp: string;
  initials: string;
  unread?: number;
  active?: boolean;
  onClick?: () => void;
};

export default function ConversationItem({
  name,
  lastMessage,
  timestamp,
  initials,
  unread = 0,
  active = false,
  onClick,
}: ConversationItemProps) {
  const hasUnreadMessages = unread > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-default p-3 text-left transition-colors ${
        active
          ? "bg-surface-elevated"
          : "hover:bg-surface-elevated/70"
      }`}
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent"
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {name}
          </span>

          <span className="shrink-0 text-xs text-text-secondary">
            {timestamp}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm ${
              hasUnreadMessages
                ? "font-medium text-foreground"
                : "text-text-secondary"
            }`}
          >
            {lastMessage}
          </span>

          {hasUnreadMessages && (
            <span
              className="size-2 shrink-0 rounded-full bg-accent"
              aria-label={`${unread} unread messages`}
              title={`${unread} unread messages`}
            />
          )}
        </div>
      </div>
    </button>
  );
}