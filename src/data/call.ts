export type CallType = "voice" | "video";

export type CallStatus =
  | "incoming"
  | "outgoing"
  | "missed"
  | "declined"
  | "completed";

export type CallRecord = {
  id: string;
  conversationId: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  type: CallType;
  status: CallStatus;
  startedAt: string;
  endedAt?: string;
  duration?: number;
};
