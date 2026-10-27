"use client";
import ConversationItem from "@/components/conversation-item";

import { Search, SquarePen } from "lucide-react";

type ConversationListProps = {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
};


const sampleConversations = [
  {
    id: "conversation-1",
    name: "Alex Morgan",
    initials: "AM",
    lastMessage: "Are we still meeting tomorrow?",
    timestamp: "10:42",
    unread: true,
  },
  {
    id: "conversation-2",
    name: "Sarah Chen",
    initials: "SC",
    lastMessage: "I've sent you the document.",
    timestamp: "10:35",
    unread: false,
  },
  {
    id: "conversation-3",
    name: "Jordan Lee",
    initials: "JL",
    lastMessage: "Thanks, talk to you later!",
    timestamp: "10:12",
    unread: false,
  },
  {
    id: "conversation-4",
    name: "Michael Johnson",
    initials: "MJ",
    lastMessage: "That sounds like a great plan.",
    timestamp: "09:58",
    unread: true,
  },
  {
    id: "conversation-5",
    name: "Emily Williams",
    initials: "EW",
    lastMessage: "Can you review the latest version?",
    timestamp: "09:41",
    unread: false,
  },
  {
    id: "conversation-6",
    name: "David Okafor",
    initials: "DO",
    lastMessage: "I'll call you when I get home.",
    timestamp: "09:18",
    unread: true,
  },
  {
    id: "conversation-7",
    name: "Olivia Martin",
    initials: "OM",
    lastMessage: "Perfect, thank you!",
    timestamp: "09:02",
    unread: false,
  },
  {
    id: "conversation-8",
    name: "Daniel Kim",
    initials: "DK",
    lastMessage: "Did you get a chance to look at it?",
    timestamp: "08:47",
    unread: false,
  },
  {
    id: "conversation-9",
    name: "Isabella Brown",
    initials: "IB",
    lastMessage: "Let's catch up this weekend.",
    timestamp: "08:26",
    unread: true,
  },
  {
    id: "conversation-10",
    name: "Christopher Anderson",
    initials: "CA",
    lastMessage: "The meeting notes are in the shared folder.",
    timestamp: "08:10",
    unread: false,
  },
  {
    id: "conversation-11",
    name: "Sophia Martinez",
    initials: "SM",
    lastMessage: "I've added my feedback to the design.",
    timestamp: "Yesterday",
    unread: true,
  },
  {
    id: "conversation-12",
    name: "William Thompson",
    initials: "WT",
    lastMessage: "See you at the office on Monday.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "conversation-13",
    name: "Grace Nkem",
    initials: "GN",
    lastMessage: "The files uploaded successfully.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "conversation-14",
    name: "Benjamin Clark",
    initials: "BC",
    lastMessage: "Could you send me the updated link?",
    timestamp: "Yesterday",
    unread: true,
  },
  {
    id: "conversation-15",
    name: "Amara Williams",
    initials: "AW",
    lastMessage: "That made my day 😂",
    timestamp: "Tue",
    unread: false,
  },
  {
    id: "conversation-16",
    name: "Samuel Peterson",
    initials: "SP",
    lastMessage: "Let me check and get back to you.",
    timestamp: "Tue",
    unread: false,
  },
  {
    id: "conversation-17",
    name: "Charlotte Evans",
    initials: "CE",
    lastMessage: "Are we still on for Saturday?",
    timestamp: "Tue",
    unread: true,
  },
  {
    id: "conversation-18",
    name: "Nathan Williams",
    initials: "NW",
    lastMessage: "Thanks for explaining that so clearly.",
    timestamp: "Mon",
    unread: false,
  },
  {
    id: "conversation-19",
    name: "Victoria James",
    initials: "VJ",
    lastMessage: "I've shared the presentation with you.",
    timestamp: "Mon",
    unread: true,
  },
  {
    id: "conversation-20",
    name: "Alexander Robertson",
    initials: "AR",
    lastMessage: "Let's discuss everything in more detail tomorrow.",
    timestamp: "Mon",
    unread: false,
  },
];



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
