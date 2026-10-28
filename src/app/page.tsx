"use client"

import AppShell from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import NavigationRail from "@/components/navigation-rail";
import ConversationList from "@/components/conversation-list";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { sampleConversations } from "@/data/conversation";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] =  useState<string | null>(null);
  const selectedConversation = sampleConversations.find((chat) => chat.id === selectedConversationId)
  return (
<AppShell>
       
<main className="flex min-h-screen">
  <NavigationRail />
  <ConversationList selectedConversationId={selectedConversationId} onSelectConversation={setSelectedConversationId} />

  <section className="flex min-w-0 flex-1 flex-col p-6">
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">{selectedConversation?.name ?? "NexText"}</h1>
      <ThemeToggle />
    </header>

   {selectedConversation ? (
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center">
      <h2 className="text-lg font-semibold">
        {selectedConversation.name}
      </h2>

      <p className="mt-2 text-sm text-text-secondary">
        Your conversation will appear here.
      </p>
    </div>
  </div>
) : (
  <div className="flex flex-1 items-center justify-center">
    <div className="max-w-sm text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-default bg-surface-elevated">
        <MessageSquareText
          size={26}
          className="text-text-secondary"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-lg font-semibold">
        Your conversations, all in one place
      </h2>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Select a conversation to start chatting.
      </p>
    </div>
  </div>
)}
  </section>
</main>
</AppShell>
  );
}