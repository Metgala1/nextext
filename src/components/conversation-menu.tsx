
"use client";

import {
  UserRound,
  Search,
  BellOff,
  Trash2,
  Ban,
} from "lucide-react";

type ConversationMenuProps = {
  onViewDetails: () => void;
  onSearch: () => void;
  onToggleMute: () => void;
  onClearConversation: () => void;
  onBlockContact: () => void;
  isMuted: boolean;
  isBlocked: boolean;
  onToggleBlock: () => void;
};

export default function ConversationMenu({
  onViewDetails,
  onSearch,
  onToggleMute,
  onClearConversation,
  onBlockContact,
  isMuted,
  isBlocked,
  onToggleBlock,
}: ConversationMenuProps) {
  return (
    <div
      role="menu"
      aria-label="Conversation options"
      className="absolute right-0 top-full z-50 mt-2 w-60 rounded-default border border-border bg-surface p-2 shadow-xl"
    >
      <button
        type="button"
        role="menuitem"
        onClick={onViewDetails}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated"
      >
        <UserRound size={17} aria-hidden="true" />
        View contact details
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onSearch}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated"
      >
        <Search size={17} aria-hidden="true" />
        Search conversation
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onToggleMute}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated"
      >
        <BellOff size={17} aria-hidden="true" />
        {isMuted ? "Unmute notifications" : "Mute notifications"}
      </button>

      <div
        role="separator"
        className="my-2 border-t border-border"
      />

      <button
        type="button"
        role="menuitem"
        onClick={onClearConversation}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-surface-elevated"
      >
        <Trash2 size={17} aria-hidden="true" />
        Clear conversation
      </button>

     <button
        type="button"
        role="menuitem"
        onClick={onToggleBlock}
        className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated ${
            isBlocked ? "text-foreground" : "text-red-500"
        }`}
        >
        <Ban size={17} aria-hidden="true" />
        {isBlocked ? "Unblock contact" : "Block contact"}
    </button>
    </div>
  );
}
