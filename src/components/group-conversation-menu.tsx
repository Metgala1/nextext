
"use client";

import {
  Users,
  Bell,
  Search,
  Trash2,
  LogOut,
  Flag,
  Pin
} from "lucide-react";

type GroupConversationMenuProps = {
  onViewDetails: () => void;
  onSearch: () => void;
  onToggleMute: () => void;
  onClearConversation: () => void;
  onLeaveGroup: () => void;
  isMuted: boolean;
  isCreator: boolean;
  onViewPinnedMessages: () => void;
};

export default function GroupConversationMenu({
  onViewDetails,
  onSearch,
  onToggleMute,
  onClearConversation,
  onLeaveGroup,
  isMuted,
  isCreator,
  onViewPinnedMessages
}: GroupConversationMenuProps) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-xl"
    >
      <button
        type="button"
        role="menuitem"
        onClick={onViewDetails}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
      >
        <Users size={17} />
        Group info
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onToggleMute}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
      >
        <Bell size={17} />
        {isMuted ? "Unmute notifications" : "Mute notifications"}
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onSearch}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
      >
        <Search size={17} />
        Search conversation
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onViewPinnedMessages}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
        >
        <Pin size={17} />
        Pinned messages
      </button>

      <div className="my-1 border-t border-border" />

      <button
        type="button"
        role="menuitem"
        onClick={onClearConversation}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-elevated"
      >
        <Trash2 size={17} />
        Clear conversation
      </button>

      {!isCreator && (
        <button
            type="button"
            role="menuitem"
            onClick={onLeaveGroup}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-500/10"
        >
            <LogOut size={17} />
            Leave group
        </button>
        )}

      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-secondary transition-colors hover:bg-elevated"
      >
        <Flag size={17} />
        Report group
      </button>
    </div>
  );
}
