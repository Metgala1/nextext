export type MessageStatus =
  | "sent"
  | "delivered"
  | "read";

export type MessageReaction = {
  emoji: string;
  userId: string;
};

export type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  senderId?: string;
  timestamp: string;
  status?: MessageStatus;

  replyTo?: string;
  replyToText?: string;
  replyToSender?: "me" | "them";
  reactions?: MessageReaction[]
  starredBy?: string[]
  forwardedFrom?: {
    messageId: string;
    conversationId: string;
  };
  editedAt?: string;
  pinnedAt?: string;
};

export function getSampleMessages(
  conversationId: string,
  contactName: string,
): Message[] {
  const messageTexts = [
    `Hey ${contactName}, how's everything going?`,
    "Things are going well. I've been making progress on the project.",
    "That's good to hear! What have you been working on?",
    "I'm improving the messaging interface one component at a time.",
    "Nice approach. Have you tested it on different screen sizes?",
    "Yes, I'm checking the layout and independent scrolling.",
    "Great! We should also make sure long messages wrap correctly.",
    "Agreed. I'll test that before moving on to the composer.",
    "Sounds like a plan. Keep me updated!",
    "Will do. Thanks for checking in.",
  ];

  return Array.from({ length: 40 }, (_, index): Message => {
    const sender = index % 3 === 0 ? "them" : "me";

    return {
      id: `${conversationId}-message-${index + 1}`,
      text: messageTexts[index % messageTexts.length],
      sender,
      timestamp: `10:${String(index % 60).padStart(2, "0")}`,
      status: sender === "me" ? "read" : undefined,
    };
  });
}