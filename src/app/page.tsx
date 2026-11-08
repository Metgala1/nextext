
"use client";

import AppShell from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import NavigationRail from "@/components/navigation-rail";
import ConversationList from "@/components/conversation-list";
import { MessageSquareText , Pin, X } from "lucide-react";
import { useState } from "react";
import { sampleConversations } from "@/data/conversation";
import ChatHeader from "@/components/chat-header";
import MessageList from "@/components/message-list";
import MessageComposer from "@/components/message-composer";
import ContactDetails from "@/components/contactDetails";
import ConfirmationModal from "@/components/confirmation-modal";
import MessageSearch from "@/components/message-search";
import ForwardMessageDialog from "@/components/forward-message-dialog";
import PinnedMessagesPanel from "@/components/pinned-message-panel";
import {
  getSampleMessages,
  type Message,
  type MessageStatus,
} from "@/data/messages";
import { CURRENT_USER_ID } from "@/data/users";
import StarredMessages from "@/components/starred-messages";

type ConfirmationAction = "clear" | "block" | "unblock";
type MessageToForward = {
  message: Message;
  conversationId: string;
};

const MAX_PINNED_MESSAGES = 3;

export default function Home() {
  const [conversations, setConversations] = useState(sampleConversations);

  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  const selectedConversation = conversations.find(
    (chat) => chat.id === selectedConversationId,
  );

  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);

  const [replyingToMessage, setReplyingToMessage] =
    useState<Message | null>(null);

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

  // Starred messages screen state
  const [isStarredMessagesOpen, setIsStarredMessagesOpen] =
    useState(false);

  const messages =
    selectedConversation &&
    !clearedConversationIds.includes(selectedConversation.id)
      ? (
          conversationMessages[selectedConversation.id] ??
          getSampleMessages(
            selectedConversation.id,
            selectedConversation.name,
          )
        ).map((message) => ({
          ...message,
          status: message.status ?? "sent",
        }))
      : [];

  const matchingMessages = messages.filter((message) =>
    message.text
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  const [isPinnedMessagesOpen, setIsPinnedMessagesOpen] =
  useState(false);

  const pinnedMessages = messages
  .filter((message) => Boolean(message.pinnedAt))
  .sort(
    (a, b) =>
      new Date(b.pinnedAt!).getTime() -
      new Date(a.pinnedAt!).getTime()
  );

  const [pinLimitNotice, setPinLimitNotice] =
  useState<string | null>(null);

  const starredMessages = conversations.flatMap((conversation) => {
    const messages =
      conversationMessages[conversation.id] ??
      getSampleMessages(conversation.id, conversation.name);

    return messages
      .filter((message) =>
        message.starredBy?.includes(CURRENT_USER_ID),
      )
      .map((message) => ({
        ...message,
        conversationId: conversation.id,
        conversationName: conversation.name,
      }));
  });

  const [activeNavigationItem, setActiveNavigationItem] =
  useState("Messages");

  const [pendingMessageId, setPendingMessageId] =
  useState<string | null>(null);

  const [messageToForward, setMessageToForward] =
  useState<MessageToForward | null>(null);

  const [messageToDelete, setMessageToDelete] = useState<{
  message: Message;
  conversationId: string;
} | null>(null);

const [messageBeingEdited, setMessageBeingEdited] =
  useState<Message | null>(null);

const [editingConversationId, setEditingConversationId] =
  useState<string | null>(null);

  function handleCancelEditing() {
  setMessageBeingEdited(null);
}

function handleStartEditing(message: Message) {
  if (!selectedConversation || message.sender !== "me") return;

  setMessageBeingEdited(message);
  setEditingConversationId(selectedConversation.id);
  setReplyingToMessage(null);
}

function handleSaveEdit(messageId: string, newText: string) {
  if (!editingConversationId || !messageBeingEdited) return;

  const conversationId = editingConversationId;

  setConversationMessages((previousMessages) => {
    const existingMessages =
      previousMessages[conversationId] ??
      getSampleMessages(
        conversationId,
        conversations.find((conversation) => conversation.id === conversationId)?.name ?? ""
      );

    return {
      ...previousMessages,
      [conversationId]: existingMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              text: newText,
              editedAt: new Date().toISOString(),
            }
          : message
      ),
    };
  });

  setMessageBeingEdited(null);
  setEditingConversationId(null);
}

function handleTogglePinMessage(message: Message) {
  if (!selectedConversation) return;

  const conversationId = selectedConversation.id;

  const existingMessages =
    conversationMessages[conversationId] ??
    getSampleMessages(conversationId, selectedConversation.name);

  const targetMessage = existingMessages.find(
    (item) => item.id === message.id
  );

  if (!targetMessage) return;

  if (targetMessage.pinnedAt) {
    setPinLimitNotice(null);
  } else {
    const pinnedCount = existingMessages.filter(
      (item) => Boolean(item.pinnedAt)
    ).length;

    if (pinnedCount >= MAX_PINNED_MESSAGES) {
      setPinLimitNotice(
        `You can only pin ${MAX_PINNED_MESSAGES} messages in a conversation. Unpin one to make room.`
      );
      return;
    }

    setPinLimitNotice(null);
  }

  setConversationMessages((previous) => {
    const currentMessages =
      previous[conversationId] ??
      getSampleMessages(conversationId, selectedConversation.name);

    return {
      ...previous,
      [conversationId]: currentMessages.map((item) => {
        if (item.id !== message.id) return item;

        if (item.pinnedAt) {
          const { pinnedAt, ...rest } = item;
          return rest;
        }

        return {
          ...item,
          pinnedAt: new Date().toISOString(),
        };
      }),
    };
  });
}
  
function handleRequestMessageDeletion(message: Message) {
  if (!selectedConversation) return;

  setMessageToDelete({
    message,
    conversationId: selectedConversation.id,
  });
}

function handleDeleteMessage() {
  if (!messageToDelete) return;

  const { message, conversationId } = messageToDelete;

  setConversationMessages((previousMessages) => {
    const existingMessages =
      previousMessages[conversationId] ??
      getSampleMessages(
        conversationId,
        conversations.find((conversation) => conversation.id === conversationId)?.name ?? ""
      );

    return {
      ...previousMessages,
      [conversationId]: existingMessages.filter(
        (existingMessage) => existingMessage.id !== message.id
      ),
    };
  });

  setMessageToDelete(null);
}
  function handleOpenForwardDialog(message: Message) {
  if (!selectedConversation) return;

  setMessageToForward({
    message,
    conversationId: selectedConversation.id,
  });
}

function handleForwardMessage(conversationIds: string[]) {
  if (!messageToForward) return;

  const { message, conversationId: sourceConversationId } =
    messageToForward;

  const forwardedAt = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  setConversationMessages((previousMessages) => {
    const updatedMessages = { ...previousMessages };

    for (const recipientId of conversationIds) {
      const recipient = conversations.find(
        (conversation) => conversation.id === recipientId
      );

      if (!recipient) continue;

      const existingMessages =
        previousMessages[recipientId] ??
        getSampleMessages(recipientId, recipient.name);

      const forwardedMessage: Message = {
        id: crypto.randomUUID(),
        text: message.text,
        sender: "me",
        timestamp: forwardedAt,
        status: "sent",
        forwardedFrom: {
          messageId: message.id,
          conversationId: sourceConversationId,
        },
        senderId: CURRENT_USER_ID
      };

      updatedMessages[recipientId] = [
        ...existingMessages,
        forwardedMessage,
      ];
    }

    return updatedMessages;
  });

  setConversations((previousConversations) => {
  const selectedIds = new Set(conversationIds);

  const updatedRecipients = previousConversations
    .filter((conversation) => selectedIds.has(conversation.id))
    .map((conversation) => ({
      ...conversation,
      lastMessage: message.text,
      timestamp: forwardedAt,
    }));

  const remainingConversations = previousConversations.filter(
    (conversation) => !selectedIds.has(conversation.id)
  );

  return [...updatedRecipients, ...remainingConversations];
});

  setMessageToForward(null);
}

  // Open and close starred messages.
  function handleOpenStarredMessages() {
  setActiveNavigationItem("Starred Messages");
  setIsStarredMessagesOpen(true);
  setIsContactDetailsOpen(false);
  setIsSearchOpen(false);
}

function handleCloseStarredMessages() {
  setIsStarredMessagesOpen(false);
  setActiveNavigationItem("Messages");
}

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    setCurrentSearchResultIndex(0);
  }

  function handleReactToMessage(messageId: string, emoji: string) {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    setConversationMessages((previousMessages) => {
      const currentMessages =
        previousMessages[conversationId] ??
        getSampleMessages(conversationId, selectedConversation.name);

      return {
        ...previousMessages,

        [conversationId]: currentMessages.map((message) => {
          if (message.id !== messageId) return message;

          const reactions = message.reactions ?? [];

          const existingUserReaction = reactions.find(
            (reaction) => reaction.userId === CURRENT_USER_ID,
          );

          // Clicking the same emoji removes the user's reaction.
          if (existingUserReaction?.emoji === emoji) {
            return {
              ...message,
              reactions: reactions.filter(
                (reaction) => reaction.userId !== CURRENT_USER_ID,
              ),
            };
          }

          // Otherwise, replace the user's previous reaction.
          return {
            ...message,
            reactions: [
              ...reactions.filter(
                (reaction) => reaction.userId !== CURRENT_USER_ID,
              ),
              { emoji, userId: CURRENT_USER_ID },
            ],
          };
        }),
      };
    });
  }

  function handleStarMessage(messageId: string) {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    setConversationMessages((previousMessages) => {
      const currentMessages =
        previousMessages[conversationId] ??
        getSampleMessages(conversationId, selectedConversation.name);

      return {
        ...previousMessages,

        [conversationId]: currentMessages.map((message) => {
          if (message.id !== messageId) return message;

          const starredBy = message.starredBy ?? [];

          const isStarred = starredBy.includes(CURRENT_USER_ID);

          return {
            ...message,
            starredBy: isStarred
              ? starredBy.filter((userId) => userId !== CURRENT_USER_ID)
              : [...starredBy, CURRENT_USER_ID],
          };
        }),
      };
    });
  }

  function handleNextSearchResult() {
    if (matchingMessages.length === 0) return;

    setCurrentSearchResultIndex(
      (current) => (current + 1) % matchingMessages.length,
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

  function handleReplyToMessage(message: Message) {
    setReplyingToMessage(message);
  }

  function toggleMuteConversation() {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    setMutedConversationIds((current) =>
      current.includes(conversationId)
        ? current.filter((id) => id !== conversationId)
        : [...current, conversationId],
    );
  }

  function clearConversation() {
    setConfirmationAction("clear");
  }

  function blockContact() {
    if (!selectedConversation) return;

    const confirmed = window.confirm(
      `Block ${selectedConversation.name}? This is a UI demonstration and will not block them on a server.`,
    );

    if (!confirmed) return;

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
      senderId: CURRENT_USER_ID,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      ...(replyingToMessage
        ? {
            replyTo: replyingToMessage.id,
            replyToText: replyingToMessage.text,
            replyToSender: replyingToMessage.sender,
          }
        : {}),
    };

    setReplyingToMessage(null);

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
                lastMessage: `You: ${text}`,
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

  function updateMessageStatus(
    messageId: string,
    status: MessageStatus,
  ) {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    setConversationMessages((previousMessages) => {
      const existingMessages =
        previousMessages[conversationId] ??
        getSampleMessages(
          conversationId,
          selectedConversation.name,
        );

      return {
        ...previousMessages,
        [conversationId]: existingMessages.map((message) =>
          message.id === messageId && message.sender === "me"
            ? { ...message, status }
            : message,
        ),
      };
    });
  }

  function getLatestOutgoingMessage() {
    if (!selectedConversation) return null;

    const currentMessages =
      conversationMessages[selectedConversation.id] ??
      getSampleMessages(
        selectedConversation.id,
        selectedConversation.name,
      );

    return (
      [...currentMessages]
        .reverse()
        .find((message) => message.sender === "me") ?? null
    );
  }

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
    setReplyingToMessage(null);

    setConversations((previousConversations) =>
      previousConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: false }
          : conversation,
      ),
    );
  }

  const latestOutgoingMessage = getLatestOutgoingMessage();

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

        {messageToForward && (
          <ForwardMessageDialog
            message={messageToForward.message}
            conversations={conversations}
            onClose={() => setMessageToForward(null)}
            onForward={handleForwardMessage}
          />
        )}

        {messageToDelete && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setMessageToDelete(null);
              }
            }}
          >
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-message-title"
              aria-describedby="delete-message-description"
              className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-2xl"
            >
              <h2
                id="delete-message-title"
                className="text-lg font-semibold text-foreground"
              >
                Delete message?
              </h2>

              <p
                id="delete-message-description"
                className="mt-2 text-sm text-text-secondary"
              >
                This message will be removed from this conversation. This action
                cannot be undone.
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMessageToDelete(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-elevated"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteMessage}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </section>
          </div>
        )}

       <NavigationRail
          activeItem={activeNavigationItem}
          onNavigate={setActiveNavigationItem}
          onOpenStarredMessages={handleOpenStarredMessages}
        />

        {isStarredMessagesOpen ? (
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <StarredMessages
              messages={starredMessages}
              onBack={handleCloseStarredMessages}
              onSelectMessage={(conversationId, messageId) => {
              setPendingMessageId(messageId);
              handleSelectConversation(conversationId);
              setIsStarredMessagesOpen(false);
              setActiveNavigationItem("Messages");
          }}
            />
          </div>
        ) : (
          <>
            <ConversationList
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              conversations={conversations}
            />

            <section className="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-6">
              <header className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                  {selectedConversation?.name ?? "NexText"}
                </h1>

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

                  {mutedConversationIds.includes(
                    selectedConversation.id,
                  ) && (
                    <p className="border-b border-border px-6 py-2 text-xs text-text-secondary">
                      Notifications are muted for this conversation.
                    </p>
                  )}

                  {blockedConversationIds.includes(
                    selectedConversation.id,
                  ) && (
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

                  {pinLimitNotice && (
                    <div
                      role="alert"
                      className="flex items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Pin size={16} className="shrink-0 text-text-secondary" />

                        <p className="text-sm text-text-secondary">
                          {pinLimitNotice}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPinLimitNotice(null)}
                        className="shrink-0 rounded-lg p-1 text-text-secondary transition-colors hover:bg-elevated hover:text-text"
                        aria-label="Dismiss notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {pinnedMessages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPinnedMessagesOpen(true);
                      }}
                      className="flex w-full items-center gap-3 border-b border-border bg-surface px-5 py-3 text-left transition-colors hover:bg-elevated"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Pin size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text">
                            Pinned message
                          </span>

                          {pinnedMessages.length > 1 && (
                            <span className="text-xs text-text-secondary">
                              +{pinnedMessages.length - 1} more
                            </span>
                          )}
                        </div>

                        <p className="truncate text-sm text-text-secondary">
                          {pinnedMessages[0].text}
                        </p>
                      </div>

                      <Pin size={15} className="shrink-0 text-text-secondary" />
                    </button>
                  )}

                  {isPinnedMessagesOpen && (
                    <PinnedMessagesPanel 
                    messages={pinnedMessages}
                    contactName={selectedConversation?.name ?? ""}
                    onClose={() => setIsPinnedMessagesOpen(false)}
                    onSelectMessage={(messageId) => {
                      setPendingMessageId(messageId);
                      setIsPinnedMessagesOpen(false)
                    }}
                    onUnpin={(messageId) => {
                      const message = pinnedMessages.find(
                        (item) => item.id === messageId
                      );

                      if (message) {
                        handleTogglePinMessage(message);
                      }
                    }}
                    />
                  )}

                  <MessageList
                    onPin={handleTogglePinMessage}
                    onEdit={handleStartEditing}
                    onDelete={handleRequestMessageDeletion}
                    onForward={handleOpenForwardDialog}
                    onStar={handleStarMessage}
                    onReact={handleReactToMessage}
                    contactName={selectedConversation.name ?? ""}
                    messages={messages}
                    searchQuery={searchQuery}
                    activeSearchMessageId={
                      matchingMessages[currentSearchResultIndex]?.id ?? null
                    }
                    onReply={handleReplyToMessage}
                    jumpToMessageId={pendingMessageId}
                    onMessageJumped={() => setPendingMessageId(null)}
                  />

                  {process.env.NODE_ENV === "development" &&
                    latestOutgoingMessage && (
                      <div className="flex items-center gap-2 border-t border-border px-4 py-2">
                        <span className="text-xs text-text-secondary">
                          Receipt simulator
                        </span>

                        <button
                          type="button"
                          disabled={latestOutgoingMessage.status !== "sent"}
                          onClick={() =>
                            updateMessageStatus(
                              latestOutgoingMessage.id,
                              "delivered",
                            )
                          }
                          className="text-xs text-accent disabled:opacity-40"
                        >
                          Mark delivered
                        </button>

                        <button
                          type="button"
                          disabled={latestOutgoingMessage.status !== "delivered"}
                          onClick={() =>
                            updateMessageStatus(
                              latestOutgoingMessage.id,
                              "read",
                            )
                          }
                          className="text-xs text-accent disabled:opacity-40"
                        >
                          Mark read
                        </button>
                      </div>
                    )}

                  <MessageComposer
                    editingMessage={messageBeingEdited}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEditing}
                    contactName={selectedConversation.name ?? ""}
                    onSend={handleSendMessage}
                    disabled={!selectedConversation}
                    replyingTo={replyingToMessage}
                    onCancelReply={() => setReplyingToMessage(null)}
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
          </>
        )}
      </main>
    </AppShell>
  );
}
