import { useEffect , useRef} from "react";
import { Check, CheckCheck } from "lucide-react";
import type { MessageStatus } from "@/data/messages";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  status: MessageStatus
};

type MessageListProps = {
  messages: Message[];
  searchQuery?: string;
  activeSearchMessageId?: string | null;
};

function MessageStatusIndicator({
  status,
}: {
  status?: MessageStatus;
}) {
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
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      role="log"
      aria-label="Messages"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6"
    >
      {messages.map((message) => {
        const isMine = message.sender === "me";
        const isActive = activeSearchMessageId === message.id;

        return (
          <div
            id={`message-${message.id}`}
            key={message.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-default px-4 py-3 ${
                isMine
                  ? "bg-accent text-white"
                  : "bg-surface-elevated text-foreground"
              }`}
            >
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

                {isMine && (
                  <MessageStatusIndicator status={message.status} />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}