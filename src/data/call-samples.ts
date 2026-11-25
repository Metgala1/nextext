import type { CallRecord } from "@/data/call";

const now = Date.now();

const hour = 60 * 60 * 1000;

export const sampleCalls: CallRecord[] = [
  {
    id: "call-1",
    conversationId: "conversation-2",
    participantId: "user-1",
    participantName: "Sarah Chen",
    participantInitials: "SC",
    type: "video",
    status: "completed",
    startedAt: new Date(now - hour).toISOString(),
    endedAt: new Date(now - hour + 12 * 60 * 1000).toISOString(),
    duration: 12 * 60,
    direction: "outgoing"
  },
  {
    id: "call-2",
    conversationId: "conversation-4",
    participantId: "user-2",
    participantName: "Michael Johnson",
    participantInitials: "MJ",
    type: "voice",
    status: "missed",
    startedAt: new Date(now - 3 * hour).toISOString(),
    direction: "incoming"
  },
  {
    id: "call-3",
    conversationId: "conversation-8",
    participantId: "user-3",
    participantName: "Daniel Kim",
    participantInitials: "DK",
    type: "voice",
    status: "completed",
    startedAt: new Date(now - 6 * hour).toISOString(),
    endedAt: new Date(now - 6 * hour + 4 * 60 * 1000).toISOString(),
    duration: 4 * 60,
    direction: "outgoing"
  },
  {
    id: "call-4",
    conversationId: "conversation-13",
    participantId: "user-4",
    participantName: "Grace Nkem",
    participantInitials: "GN",
    type: "video",
    status: "declined",
    startedAt: new Date(now - 12 * hour).toISOString(),
    direction: "incoming"
  },
  {
    id: "call-5",
    conversationId: "conversation-6",
    participantId: "user-5",
    participantName: "David Okafor",
    participantInitials: "DO",
    type: "voice",
    status: "completed",
    startedAt: new Date(now - 24 * hour).toISOString(),
    endedAt: new Date(now - 24 * hour + 8 * 60 * 1000).toISOString(),
    duration: 8 * 60,
    direction: "outgoing"
  },
];
