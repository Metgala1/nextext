"use client";
import ConversationItem from "@/components/conversation-item";

import { Search, SquarePen } from "lucide-react";
import { sampleConversations } from "@/data/conversation";

type ConversationListProps = {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
};





export default function ConversationList(
    {
      selectedConversationId,
      onSelectConversation,  
    }: ConversationListProps
) {
  return (
    <section
      aria-label="Conversations"
      className="flex h-screen min-h-0 w-[350px] shrink-0 flex-col overflow-hidden border-r border-border bg-background"
    >
      <header className="border-b border-border p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Messages
          </h2>

          <button
            type="button"
            aria-label="New message"
            className="flex size-10 items-center justify-center rounded-default bg-accent text-white transition-opacity hover:opacity-90"
          >
            <SquarePen size={19} aria-hidden="true" />
          </button>
        </div>

        <label className="flex h-11 items-center gap-3 rounded-default border border-border bg-surface px-3 focus-within:border-accent">
          <Search
            size={18}
            className="shrink-0 text-text-secondary"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
          />
        </label>
      </header>

     <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {sampleConversations.map((conversation) => (
            <ConversationItem
                key={conversation.id}
                name={conversation.name}
                initials={conversation.initials}
                lastMessage={conversation.lastMessage}
                timestamp={conversation.timestamp}
                unread={conversation.unread}
                active={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
            />
        ))}
    </div>
    </section>
  );
}
