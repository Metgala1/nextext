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
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)

  const [mutedConversationIds, setMutedConversationIds] = useState<string[]>([]);
  const [clearedConversationIds, setClearedConversationIds] = useState<string[]>([]);
  const [blockedConversationIds, setBlockedConversationIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messages =
  selectedConversation &&
  !clearedConversationIds.includes(selectedConversation.id)
    ? getSampleMessages(
        selectedConversation.id,
        selectedConversation.name,
      )
    : [];

  const filteredMessages = messages.filter((message) =>
    message.text
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
   );

  function toggleMuteConversation() {
    if(!selectedConversation) {
      return
    }
    const conversationId = selectedConversation.id

    setMutedConversationIds((current) => 
      current.includes(conversationId) ? current.filter((id) => id !== conversationId) 
      : [...current , conversationId]
    )
  }

  function clearConversation() {
    if(!selectedConversation){
      return
    }

    const confirmed = window.confirm(
      `Clear the conversation with ${selectedConversation.name}`
    )

    if(!confirmed) {
      return
    }

    setClearedConversationIds((current) => 
    current.includes(selectedConversation.id) ? current
    : [...current , selectedConversation.id]
    )
  }

  function blockContact() {
    if(!selectedConversation) {
      return
    }

    const confirmed = window.confirm(
    `Block ${selectedConversation.name}? This is a UI demonstration and will not block them on a server.`,
    );

    if(!confirmed) {
      return
    }

    setBlockedConversationIds((current) =>
    current.includes(selectedConversation.id)
      ? current
      : [...current, selectedConversation.id],
    );

  }

  function toggleBlockContact() {
  if (!selectedConversation) return;

  const conversationId = selectedConversation.id;
  const isCurrentlyBlocked =
    blockedConversationIds.includes(conversationId);

  if (isCurrentlyBlocked) {
    const confirmed = window.confirm(
      `Unblock ${selectedConversation.name}?`,
    );

    if (!confirmed) return;

    setBlockedConversationIds((current) =>
      current.filter((id) => id !== conversationId),
    );

    return;
  }

  const confirmed = window.confirm(
    `Block ${selectedConversation.name}? This is a UI demonstration and will not block them on a server.`,
  );

  if (!confirmed) return;

  setBlockedConversationIds((current) =>
    current.includes(conversationId)
      ? current
      : [...current, conversationId],
  );
 }



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
          onSearch={() => {
            setIsSearchOpen(true);
            setSearchQuery("");
          }}
          onToggleMute={toggleMuteConversation}
          onClearConversation={clearConversation}
          onBlockContact={blockContact}
          isMuted={mutedConversationIds.includes(
            selectedConversation.id,
          )}
          isBlocked={blockedConversationIds.includes(
            selectedConversation.id,
            )}
          onToggleBlock={toggleBlockContact}
        />
        {mutedConversationIds.includes(selectedConversation.id) && (
          <p className="border-b border-border px-6 py-2 text-xs text-text-secondary">
            Notifications are muted for this conversation.
          </p>
        )}

        {blockedConversationIds.includes(selectedConversation.id) && (
          <p className="border-b border-border px-6 py-2 text-xs text-red-500">
            This contact is blocked in this demo.
          </p>
        )}

        {isSearchOpen && (
          <div className="shrink-0 border-b border-border p-3">
            <label className="block">
              <span className="sr-only">Search conversation messages</span>
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-default border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="mt-2 text-sm text-text-secondary hover:text-foreground"
            >
              Close search
            </button>

            {searchQuery.trim() && (
              <p className="mt-2 text-xs text-text-secondary">
                {filteredMessages.length} matching message(s)
              </p>
            )}
          </div>
        )}

      <MessageList
        messages={isSearchOpen && searchQuery.trim()
          ? filteredMessages
          : messages}
      />
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