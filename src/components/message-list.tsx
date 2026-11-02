import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, MoreVertical } from "lucide-react";
import type { Message, MessageStatus } from "@/data/messages";
import MessageActionsMenu from "./message-actions";
import type { MessageAction } from "./message-actions";

type MessageListProps = {
  messages: Message[];
  searchQuery?: string;
  activeSearchMessageId?: string | null;
  onReply: (message: Message) => void;
  contactName: string;
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
  contactName
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(
    null,
  );
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
  null,
  );

function handleMessageContextMenu(
  event: React.MouseEvent<HTMLDivElement>,
  messageId: string,
) {
  event.preventDefault();
  setOpenMessageMenuId(messageId);
}

function handleTouchStart(messageId: string) {
  longPressTimerRef.current = setTimeout(() => {
    setOpenMessageMenuId(messageId);
    longPressTimerRef.current = null;
  }, 500);
}

function handleTouchEnd() {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
}

async function handleMessageAction(
  message: Message,
  action: MessageAction,
) {
  setOpenMessageMenuId(null);

  if (action === "reply") {
    onReply(message);
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
  
  useEffect(() => {
  if (!openMessageMenuId) return;

  function handlePointerDown(event: PointerEvent) {
    const target = event.target;

    if (
      target instanceof Element &&
      !target.closest("[data-message-menu-root]")
    ) {
      setOpenMessageMenuId(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setOpenMessageMenuId(null);
    }
  }

  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [openMessageMenuId]);

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
        const isActive = activeSearchMessageId === message.id;
        const isMenuOpen = openMessageMenuId === message.id;

        const optionsControl = (
          <div className="relative self-center">
            <button
              type="button"
              aria-label="Message options"
              aria-expanded={isMenuOpen}
              onClick={() =>
                setOpenMessageMenuId((current) =>
                  current === message.id ? null : message.id,
                )
              }
              className={`self-center rounded-md p-1.5 text-text-secondary transition-opacity hover:bg-surface-elevated hover:text-foreground focus:opacity-100 group-hover:opacity-100 ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <MessageActionsMenu
                onAction={(action: MessageAction) =>
                  handleMessageAction(message, action)
                }
              />
            )}
          </div>
        );

        return (
          <div
            id={`message-${message.id}`}
            key={message.id}
            data-message-menu-root
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

            <div
              className={`max-w-[75%] rounded-default px-4 py-3 ${
                isMine
                  ? "bg-accent text-white"
                  : "bg-surface-elevated text-foreground"
              }`}
            >
              {message.replyTo && (
                <div className="mb-2 rounded-md border-l-2 border-accent bg-black/10 px-3 py-2">
                  <p className="mb-1 text-xs font-semibold text-accent">
                    {message.replyToSender === "me"
                      ? "You"
                      : contactName}
                  </p>

                  <p className="line-clamp-2 break-words text-xs text-current/75">
                    {message.replyToText}
                  </p>
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

                {isMine && <MessageStatusIndicator status={message.status} />}
              </div>
            </div>

            {!isMine && optionsControl}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}