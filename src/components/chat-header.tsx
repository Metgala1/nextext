
"use client";
import { useEffect, useRef, useState } from "react";
import ConversationMenu from "@/components/conversation-menu";
import GroupConversationMenu from "@/components/group-conversation-menu";

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
  onSearch: () => void;
  onToggleMute: () => void;
  onClearConversation: () => void;
  onBlockContact: () => void;
  isMuted: boolean;
  isBlocked: boolean;
  onToggleBlock: () => void;
  isGroup: boolean;
  memberCount: number;
  photoUrl?: string;
  onLeaveGroup: () => void;
  isGroupCreator: boolean;
  isGroupMuted: boolean;
  onToggleGroupMute: () => void;
  onViewPinnedMessages: () => void;
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
 
};

export default function ChatHeader({
  name,
  initials,
  onNameClick,
  isOnline,
  lastSeen,
  onSearch,
  onToggleMute,
  onClearConversation,
  onBlockContact,
  isMuted,
  isBlocked,
  onToggleBlock,
  isGroup,
  memberCount,
  photoUrl,
  onLeaveGroup,
  isGroupCreator,
  isGroupMuted,
  onToggleGroupMute,
  onViewPinnedMessages,
  onStartVideoCall,
  onStartVoiceCall
  
}: ChatHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isMenuOpen) return;

      function handlePointerDown(event: PointerEvent) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setIsMenuOpen(false);
        }
      }

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
}, [isMenuOpen]);
    
  return (
    <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-border px-6">
      <div
        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent"
        aria-hidden="true"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onNameClick}
          className="block truncate text-left text-sm font-semibold transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {name}
        </button>

        {isGroup ? (
          <p className="mt-1 truncate text-xs text-text-secondary">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </p>
        ) : isOnline ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-green-500">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-green-500"
            />
            Online
          </p>
        ) : (
          <p className="mt-1 truncate text-xs text-text-secondary">
            {lastSeen ? `Last seen ${lastSeen}` : "Offline"}
          </p>
        )}
      </div>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onStartVoiceCall}
          type="button"
          aria-label="Start voice call"
          title="Voice call"
          className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Phone size={19} aria-hidden="true" />
        </button>

        <button
          onClick={onStartVideoCall}
          type="button"
          aria-label="Start video call" 
          title="Video call"
          className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Video size={20} aria-hidden="true" />
        </button>

        
        <div ref={menuRef} className="relative">
        <button
            type="button"
            aria-label="More conversation options"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            title="More options"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <EllipsisVertical size={20} aria-hidden="true" />
        </button>

          {isMenuOpen && (
            isGroup ? (
              <GroupConversationMenu
                isCreator={isGroupCreator}
                onViewDetails={() => {
                  setIsMenuOpen(false);
                  onNameClick();
                }}
                onSearch={() => {
                  setIsMenuOpen(false);
                  onSearch();
                }}
                onToggleMute={() => {
                  setIsMenuOpen(false);
                  onToggleGroupMute();
                }}
                onClearConversation={() => {
                  setIsMenuOpen(false);
                  onClearConversation();
                }}
                onLeaveGroup={() => {
                  setIsMenuOpen(false);
                  onLeaveGroup();
                }}
                isMuted={isGroupMuted}
                onViewPinnedMessages={() => {
                  setIsMenuOpen(false);
                  onViewPinnedMessages();
                }}
              />
            ) : (
              <ConversationMenu
                onViewDetails={() => {
                  setIsMenuOpen(false);
                  onNameClick();
                }}
                onSearch={() => {
                  setIsMenuOpen(false);
                  onSearch();
                }}
                onToggleMute={onToggleMute}
                onClearConversation={onClearConversation}
                onBlockContact={onBlockContact}
                isMuted={isMuted}
                isBlocked={isBlocked}
                onToggleBlock={onToggleBlock}
              />
            )
          )}
        </div>

      </div>
    </header>
  );
}
