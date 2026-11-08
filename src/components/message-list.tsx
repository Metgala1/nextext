import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, MoreVertical, Star, Forward } from "lucide-react";
import type { Message, MessageStatus } from "@/data/messages";
import MessageActionsMenu from "./message-actions";
import type { MessageAction } from "./message-actions";
import ReactionPicker from "./reaction-picker";
import { CURRENT_USER_ID } from "@/data/messages";

type MessageListProps = {
  messages: Message[];
  searchQuery?: string;
  activeSearchMessageId?: string | null;
  onReply: (message: Message) => void;
  contactName: string;
  onReact: (messageId: string, emoji: string) => void;
  onStar: (messageId: string) => void;
  jumpToMessageId?: string | null;
  onMessageJumped?: () => void;
  onForward?: (message: Message) => void;
  onDelete: (message: Message) => void;
  onEdit: (message: Message) => void;
  onPin: (message: Message) => void;
};

function MessageStatusIndicator({ status }: { status?: MessageStatus }) {
  if (!status) return null;

  if (status === "sent") {
    return (
      <Check
        size={14}
        strokeWidth={2.5}
        className="shrink-0 text-white"
        aria-label="Sent"
      />
    );
  }

  return (
    <CheckCheck
      size={16}
      strokeWidth={2.5}
      className={`shrink-0 ${
        status === "read" ? "text-sky-300" : "text-white"
      }`}
      aria-label={status === "read" ? "Read" : "Delivered"}
    />
  );
}

function highlightText(text: string, query: string, isActive: boolean) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return text;

  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Splitting on a capture group puts every match at an odd index.
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return parts.map((part, index) => {
    const isMatch = index % 2 === 1;

    if (!isMatch) return part;

    return (
      <mark
        key={index}
        className={`rounded-sm bg-accent/25 text-foreground ${
          isActive ? "ring-2 ring-accent/70" : ""
        }`}
      >
        {part}
      </mark>
    );
  });
}

export default function MessageList({
  messages,
  searchQuery = "",
  activeSearchMessageId = null,
  onReply,
  contactName,
  onReact,
  onStar,
  jumpToMessageId,
  onMessageJumped,
  onForward,
  onDelete,
  onEdit,
  onPin
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(
    null,
  );
  const [activeReactionPickerMessageId, setActiveReactionPickerMessageId] =
    useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!jumpToMessageId) return;

    const targetMessage = document.getElementById(
      `message-${jumpToMessageId}`,
    );

    if (!targetMessage) return;

    targetMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedMessageId(jumpToMessageId);
    onMessageJumped?.();
  }, [jumpToMessageId, messages, onMessageJumped]);

  // Remove the "jumped to" highlight after a few seconds.
  useEffect(() => {
    if (!highlightedMessageId) return;

    const timeoutId = setTimeout(() => {
      setHighlightedMessageId(null);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [highlightedMessageId]);

  function handleJumpToMessage(messageId: string) {
    const targetMessage = document.getElementById(`message-${messageId}`);

    if (!targetMessage) return;

    targetMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedMessageId(messageId);
  }

  // Only one popup (actions menu or reaction picker) is open at a time.
  function openMenuFor(messageId: string | null) {
    setActiveReactionPickerMessageId(null);
    setOpenMessageMenuId(messageId);
  }

  function handleMessageContextMenu(
    event: React.MouseEvent<HTMLDivElement>,
    messageId: string,
  ) {
    event.preventDefault();
    openMenuFor(messageId);
  }

  function handleTouchStart(messageId: string) {
    longPressTimerRef.current = setTimeout(() => {
      openMenuFor(messageId);
      longPressTimerRef.current = null;
    }, 500);
  }

  function handleTouchEnd() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  async function handleMessageAction(message: Message, action: MessageAction) {
    setOpenMessageMenuId(null);

    if (action === "reply") {
      onReply(message);
      return;
    }

    if (action === "react") {
      setActiveReactionPickerMessageId(message.id);
      return;
    }

    if (action === "star") {
      onStar(message.id);
      return;
    }

    if (action === "forward") {
      onForward?.(message);
      return;
    }

    if (action === "delete") {
      onDelete(message);
      return;
    }

    if (action === "pin" || action === "unpin") {
      onPin(message);
      return;
    }

    if (action === "edit") {
      if (message.sender !== "me") return;

      onEdit(message);
      return;
    }

    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(message.text);
      } catch (error) {
        console.error("Failed to copy message:", error);
      }
    }
  }

  // Close the menu / reaction picker on outside click or Escape.
  useEffect(() => {
    if (!openMessageMenuId && !activeReactionPickerMessageId) return;

    function closePopups() {
      setOpenMessageMenuId(null);
      setActiveReactionPickerMessageId(null);
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Element &&
        !target.closest("[data-message-menu-root]")
      ) {
        closePopups();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePopups();
      }
    }

    // Capture phase so stopPropagation elsewhere can't block it.
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMessageMenuId, activeReactionPickerMessageId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    if (!activeSearchMessageId) return;

    document
      .getElementById(`message-${activeSearchMessageId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeSearchMessageId]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      role="log"
      aria-label="Messages"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6"
    >
      {messages.map((message) => {
        const isMine = message.sender === "me";
        const isReplyTargetMissing =
          Boolean(message.replyTo) &&
          !messages.some(
            (originalMessage) => originalMessage.id === message.replyTo,
          );
        const isActive = activeSearchMessageId === message.id;
        const isMenuOpen = openMessageMenuId === message.id;
        const isReactionPickerOpen =
          activeReactionPickerMessageId === message.id;

        // data-message-menu-root lives on this wrapper only, so clicks on the
        // bubble or anywhere else count as "outside". The picker is rendered
        // inside it, so clicking the picker doesn't close it.
        const optionsControl = (
          <div data-message-menu-root className="relative self-center">
            <button
              type="button"
              aria-label="Message options"
              aria-expanded={isMenuOpen}
              onClick={() => openMenuFor(isMenuOpen ? null : message.id)}
              className={`self-center rounded-md p-1.5 text-text-secondary transition-opacity hover:bg-surface-elevated hover:text-foreground focus:opacity-100 group-hover:opacity-100 ${
                isMenuOpen || isReactionPickerOpen
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <MessageActionsMenu
                isPinned={Boolean(message.pinnedAt)}
                isOwnMessage={isMine}
                onAction={(action: MessageAction) =>
                  handleMessageAction(message, action)
                }
              />
            )}

            {isReactionPickerOpen && (
              <div
                className={`absolute bottom-full z-50 mb-2 ${
                  isMine ? "right-0" : "left-0"
                }`}
              >
                <ReactionPicker
                  onSelect={(emoji) => {
                    onReact(message.id, emoji);
                    setActiveReactionPickerMessageId(null);
                  }}
                />
              </div>
            )}
          </div>
        );

        return (
          <div
            id={`message-${message.id}`}
            key={message.id}
            onContextMenu={(event) =>
              handleMessageContextMenu(event, message.id)
            }
            onTouchStart={() => handleTouchStart(message.id)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className={`group relative flex gap-1 ${
              isMine ? "justify-end" : "justify-start"
            }`}
          >
            {/* My messages: options on the left of the bubble */}
            {isMine && optionsControl}

            {/* Column wrapper: bubble on top, reactions underneath */}
            <div
              className={`flex max-w-[75%] flex-col ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-default px-4 py-3 ${
                  isMine
                    ? "bg-accent text-white"
                    : "bg-surface-elevated text-foreground"
                } ${
                  highlightedMessageId === message.id
                    ? "animate-bounce ring-2 ring-accent ring-offset-2 ring-offset-background"
                    : ""
                }`}
              >
                {message.replyTo && (
                  <button
                    type="button"
                    onClick={() => handleJumpToMessage(message.replyTo!)}
                    className="mb-2 block w-full rounded-md border-l-2 border-accent bg-black/10 px-3 py-2 text-left transition-colors hover:bg-black/20"
                    aria-label="Jump to original message"
                  >
                    <p className="mb-1 text-xs font-semibold text-accent">
                      {message.replyToSender === "me" ? "You" : contactName}
                    </p>

                    {isReplyTargetMissing ? (
                      <p className="text-xs italic text-text-secondary">
                        Original message deleted
                      </p>
                    ) : (
                      <p className="line-clamp-2 text-xs text-text-secondary">
                        {message.replyToText}
                      </p>
                    )}
                  </button>
                )}
                {message.editedAt && (
                  <span className="ml-2 text-[10px] italic text-text-secondary">
                    Edited
                  </span>
                )}
                {message.forwardedFrom && (
                  <div
                    className={`mb-1 flex items-center gap-1 text-xs italic ${
                      isMine ? "text-white/80" : "text-text-secondary"
                    }`}
                  >
                    <Forward size={12} />
                    <span>Forwarded</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {highlightText(message.text, searchQuery, isActive)}
                </p>

                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span
                    className={`text-[10px] font-medium leading-none ${
                      isMine ? "text-white/80" : "text-text-secondary"
                    }`}
                  >
                    {message.timestamp}
                  </span>

                  {message.starredBy?.includes(CURRENT_USER_ID) && (
                    <Star
                      size={12}
                      className="shrink-0 fill-current text-amber-400"
                      aria-label="Starred message"
                    />
                  )}

                  {isMine && (
                    <MessageStatusIndicator status={message.status} />
                  )}
                </div>
              </div>

              {message.reactions && message.reactions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(
                    message.reactions.reduce<
                      Record<string, { count: number; reactedByMe: boolean }>
                    >((groups, reaction) => {
                      const group = groups[reaction.emoji] ?? {
                        count: 0,
                        reactedByMe: false,
                      };

                      group.count += 1;

                      if (reaction.userId === CURRENT_USER_ID) {
                        group.reactedByMe = true;
                      }

                      groups[reaction.emoji] = group;

                      return groups;
                    }, {}),
                  ).map(([emoji, group]) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`React with ${emoji}. ${group.count} reactions`}
                      onClick={() => onReact(message.id, emoji)}
                      className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors hover:border-accent ${
                        group.reactedByMe
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <span>{emoji}</span>
                      <span className="text-text-secondary">
                        {group.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Their messages: options on the right of the bubble */}
            {!isMine && optionsControl}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}