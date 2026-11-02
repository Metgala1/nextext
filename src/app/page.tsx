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
import MessageComposer from "@/components/message-composer";
import ContactDetails from "@/components/contactDetails";
import ConfirmationModal from "@/components/confirmation-modal";
import MessageSearch from "@/components/message-search";
import { getSampleMessages, type Message } from "@/data/messages";

type ConfirmationAction = "clear" | "block" | "unblock";

export default function Home() {
  const [conversations, setConversations] = useState(sampleConversations);
  const [selectedConversationId, setSelectedConversationId] =  useState<string | null>(null);
  const selectedConversation = conversations.find((chat) => chat.id === selectedConversationId)
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)

  const [mutedConversationIds, setMutedConversationIds] = useState<string[]>([]);
  const [clearedConversationIds, setClearedConversationIds] = useState<string[]>([]);
  const [blockedConversationIds, setBlockedConversationIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [confirmationAction, setConfirmationAction] =
  useState<ConfirmationAction | null>(null);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] =
  useState(0);
  const [conversationMessages, setConversationMessages] =
  useState<Record<string, Message[]>>({});
  

  const messages =
  selectedConversation &&
  !clearedConversationIds.includes(selectedConversation.id)
    ? conversationMessages[selectedConversation.id] ??
      getSampleMessages(
        selectedConversation.id,
        selectedConversation.name,
      )
    : [];
  
  const matchingMessages = messages.filter((message) =>
  message.text
    .toLowerCase()
    .includes(searchQuery.trim().toLowerCase()),
  );

function handleSearchQueryChange(value: string) {
  setSearchQuery(value);
  setCurrentSearchResultIndex(0);
}

function handleNextSearchResult() {
  if (matchingMessages.length === 0) return;

  setCurrentSearchResultIndex((current) =>
    (current + 1) % matchingMessages.length,
  );
}

function handlePreviousSearchResult() {
  if (matchingMessages.length === 0) return;

  setCurrentSearchResultIndex((current) =>
    current === 0
      ? matchingMessages.length - 1
      : current - 1,
  );
}

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
    setConfirmationAction("clear");
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

    const isCurrentlyBlocked =
      blockedConversationIds.includes(selectedConversation.id);

    setConfirmationAction(
      isCurrentlyBlocked ? "unblock" : "block",
    );
}

function handleConfirmAction() {
  if (!selectedConversation || !confirmationAction) return;

  const conversationId = selectedConversation.id;

  if (confirmationAction === "clear") {
    setClearedConversationIds((current) =>
      current.includes(conversationId)
        ? current
        : [...current, conversationId],
    );
  }

  if (confirmationAction === "block") {
    setBlockedConversationIds((current) =>
      current.includes(conversationId)
        ? current
        : [...current, conversationId],
    );
  }

  if (confirmationAction === "unblock") {
    setBlockedConversationIds((current) =>
      current.filter((id) => id !== conversationId),
    );
  }

  setConfirmationAction(null);
}

function handleSendMessage(text: string) {
  if (!selectedConversation) return;

  const conversationId = selectedConversation.id;

  const newMessage: Message = {
    id: crypto.randomUUID(),
    text,
    sender: "me",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setConversationMessages((previousMessages) => {
    const existingMessages =
      previousMessages[conversationId] ??
      getSampleMessages(
        conversationId,
        selectedConversation.name,
      );

    return {
      ...previousMessages,
      [conversationId]: [...existingMessages, newMessage],
    };
  });

  setConversations((previousConversations) => {
  const updatedConversations = previousConversations.map(
    (conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            lastMessage: text,
            timestamp: newMessage.timestamp,
          }
        : conversation,
  );

  return updatedConversations.sort((a, b) => {
    if (a.id === conversationId) return -1;
    if (b.id === conversationId) return 1;
    return 0;
  });
});
}

function handleSelectConversation(conversationId: string) {
  setSelectedConversationId(conversationId);

  setConversations((previousConversations) =>
    previousConversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, unread: false }
        : conversation,
    ),
  );
}




return (
<AppShell>
       
<main className="flex h-screen overflow-hidden">
  <ConfirmationModal
    isOpen={confirmationAction !== null}
    title={
      confirmationAction === "clear"
        ? "Clear conversation?"
        : confirmationAction === "block"
          ? "Block contact?"
          : "Unblock contact?"
    }
    description={
      confirmationAction === "clear"
        ? `This will remove the displayed messages with ${selectedConversation?.name}. This demo action does not permanently delete server data.`
        : confirmationAction === "block"
          ? `Are you sure you want to block ${selectedConversation?.name}? This is currently a frontend demonstration.`
          : `Are you sure you want to unblock ${selectedConversation?.name}?`
    }
    confirmLabel={
      confirmationAction === "clear"
        ? "Clear conversation"
        : confirmationAction === "block"
          ? "Block contact"
          : "Unblock contact"
    }
    destructive={confirmationAction !== "unblock"}
    onConfirm={handleConfirmAction}
    onCancel={() => setConfirmationAction(null)}
/>
    <NavigationRail />
    <ConversationList 
      selectedConversationId={selectedConversationId} 
      onSelectConversation={handleSelectConversation}
      conversations={conversations}
      />

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
          <MessageSearch
            query={searchQuery}
            onQueryChange={handleSearchQueryChange}
            resultCount={matchingMessages.length}
            currentResult={
              matchingMessages.length > 0
                ? currentSearchResultIndex + 1
                : 0
            }
            onPrevious={handlePreviousSearchResult}
            onNext={handleNextSearchResult}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
              setCurrentSearchResultIndex(0);
            }}
          />
        )}

      <MessageList
        messages={messages}
        searchQuery={searchQuery}
        activeSearchMessageId={
          matchingMessages[currentSearchResultIndex]?.id ?? null
        }
      />
          <MessageComposer 
          onSend={handleSendMessage}
          disabled={!selectedConversation}
          />
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
