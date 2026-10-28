"use client"

import AppShell from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import NavigationRail from "@/components/navigation-rail";
import ConversationList from "@/components/conversation-list";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { sampleConversations } from "@/data/conversation";
import ChatHeader from "@/components/chat-header";
import MessageList from "@/components/message-list";
import { getSampleMessages } from "@/data/messages";
import MessageComposer from "@/components/message-composer";
import ContactDetails from "@/components/contactDetails";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] =  useState<string | null>(null);
  const selectedConversation = sampleConversations.find((chat) => chat.id === selectedConversationId)
  const messages = selectedConversation ? getSampleMessages(selectedConversation.id, selectedConversation.name) : []
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)



  return (
<AppShell>
       
<main className="flex h-screen overflow-hidden">
  <NavigationRail />
  <ConversationList selectedConversationId={selectedConversationId} onSelectConversation={setSelectedConversationId} />

  <section className="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-6">
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">{selectedConversation?.name ?? "NexText"}</h1>
      <ThemeToggle />
    </header>

   {selectedConversation ? (
    <div className="flex flex-1 flex-col overflow-hidden">
    <ChatHeader
      name={selectedConversation.name}
      initials={selectedConversation.initials}
      onNameClick={() => setIsContactDetailsOpen(true)}
      isOnline={selectedConversation.isOnline}
      lastSeen={selectedConversation.lastSeen}
    />

    <MessageList messages={messages} />
    <MessageComposer />
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
  {isContactDetailsOpen && selectedConversation && (
  <ContactDetails
    name={selectedConversation.name}
    initials={selectedConversation.initials}
    onClose={() => setIsContactDetailsOpen(false)}
  />
)}
</main>
</AppShell>
  );
}