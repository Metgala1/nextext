
"use client";

import { useMemo, useState } from "react";
import { Search, X, Send } from "lucide-react";
import type { Conversation } from "@/data/conversation";
import type { Message } from "@/data/messages";

type ForwardMessageDialogProps = {
  message: Message;
  conversations: Conversation[];
  onClose: () => void;
  onForward: (conversationIds: string[]) => void;
};

export default function ForwardMessageDialog({
  message,
  conversations,
  onClose,
  onForward,
}: ForwardMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationIds, setSelectedConversationIds] =
    useState<string[]>([]);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  function toggleConversation(conversationId: string) {
    setSelectedConversationIds((previous) =>
      previous.includes(conversationId)
        ? previous.filter((id) => id !== conversationId)
        : [...previous, conversationId]
    );
  }

  function handleForward() {
    if (selectedConversationIds.length === 0) return;

    onForward(selectedConversationIds);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="forward-dialog-title"
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="forward-dialog-title"
            className="font-semibold text-foreground"
          >
            Forward message
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-elevated hover:text-foreground"
          >
            <X size={18} />
          </button>
        </header>

        <div className="border-b border-border p-4">
          <div className="rounded-default border border-border bg-surface-elevated p-3">
            <p className="mb-1 text-xs font-semibold text-text-secondary">
              MESSAGE PREVIEW
            </p>

            <p className="line-clamp-3 text-sm text-foreground">
              {message.text}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 rounded-default border border-border bg-background px-3">
            <Search size={17} className="text-text-secondary" />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
            />
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Select recipients
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
          {filteredConversations.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-secondary">
              No conversations found.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredConversations.map((conversation) => {
                const isSelected = selectedConversationIds.includes(
                  conversation.id
                );

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-default p-3 text-left transition-colors ${
                      isSelected
                        ? "bg-accent/10"
                        : "hover:bg-surface-elevated"
                    }`}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-foreground">
                      {conversation.initials}
                    </div>

                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {conversation.name}
                    </span>

                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-accent bg-accent text-white"
                          : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <span className="text-xs">✓</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-border p-4">
          <span className="text-xs text-text-secondary">
            {selectedConversationIds.length} selected
          </span>

          <button
            type="button"
            disabled={selectedConversationIds.length === 0}
            onClick={handleForward}
            className="flex items-center gap-2 rounded-default bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={15} />
            Forward
          </button>
        </footer>
      </section>
    </div>
  );
}
