export type CallType = "voice" | "video";

export type CallDirection = "incoming" | "outgoing";

export type CallStatus =
  | "ringing"
  | "active"
  | "completed"
  | "missed"
  | "declined";

export type CallRecord = {
  id: string;
  conversationId: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  type: CallType;
  direction: CallDirection;
  status: CallStatus;
  startedAt: string;
  endedAt?: string;
  duration?: number;
};
