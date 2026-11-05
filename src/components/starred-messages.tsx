
"use client";

import { ArrowLeft, Star } from "lucide-react";
import type { Message } from "@/data/messages";

type StarredMessage = Message & {
  conversationId: string;
  conversationName: string;
};

type StarredMessagesProps = {
  messages: StarredMessage[];
  onBack: () => void;
  onSelectMessage: (conversationId: string, messageId: string) => void;
};

export default function StarredMessages({
  messages,
  onBack,
  onSelectMessage,
}: StarredMessagesProps) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Starred messages
          </h2>
          <p className="text-xs text-text-secondary">
            {messages.length} saved {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-elevated text-amber-400">
              <Star size={25} />
            </div>

            <h3 className="font-semibold text-foreground">
              No starred messages yet
            </h3>

            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Star important messages to keep them here for easy access.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {messages.map((message) => (
              <button
                key={`${message.conversationId}-${message.id}`}
                type="button"
                onClick={() =>
                  onSelectMessage(message.conversationId, message.id)
                }
                className="w-full rounded-default border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-elevated"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {message.conversationName}
                  </span>

                  <Star
                    size={14}
                    className="shrink-0 fill-current text-amber-400"
                  />
                </div>

                <p className="line-clamp-3 text-sm text-text-secondary">
                  {message.text}
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                  {message.sender === "me" ? "You" : message.conversationName}
                  {" · "}
                  {message.timestamp}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
