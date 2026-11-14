import { CURRENT_USER } from "./users";


export type ConversationType = "direct" | "group";

export type GroupRole = "admin" | "member";

export type ConversationParticipant = {
  id: string;
  name: string;
  initials: string;
  role?: GroupRole;
  isOnline?: boolean;
  lastSeen?: string | null;
};

type ConversationBase = {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  lastSeen: string | null;
};

export type DirectConversation = ConversationBase & {
  type: "direct";
};

export type GroupConversation = ConversationBase & {
  type: "group";
  participants: ConversationParticipant[];
  createdBy: string;
  description?: string;
};

export type Conversation = DirectConversation | GroupConversation;

export function getDirectParticipants(
  conversation: DirectConversation,
): ConversationParticipant[] {
  return [
    {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      role: "member",
    },
    {
      id: `${conversation.id}-contact`,
      name: conversation.name,
      initials: conversation.initials,
      role: "member",
      isOnline: conversation.isOnline,
      lastSeen: conversation.lastSeen,
    },
  ];
}

export function createGroupConversation({
  name,
  description,
  participants,
  createdBy,
}: {
  name: string;
  description?: string;
  participants: ConversationParticipant[];
  createdBy: string;
}): GroupConversation {
  return {
    id: crypto.randomUUID(),
    type: "group",
    name,
    initials: name.slice(0, 2).toUpperCase(),
    lastMessage: "Group created",
    timestamp: new Date().toISOString(),
    unread: 0,
    isOnline: false,
    lastSeen: null,
    participants,
    createdBy,
    description,
  };
}


export const sampleConversations: DirectConversation[] = [
  {
    id: "conversation-1",
    name: "Alex Morgan",
    initials: "AM",
    lastMessage: "Are we still meeting tomorrow?",
    timestamp: "10:42",
    unread: 1,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-2",
    name: "Sarah Chen",
    initials: "SC",
    lastMessage: "I've sent you the document.",
    timestamp: "10:35",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen 12 minutes ago",
    type: "direct",
  },
  {
    id: "conversation-3",
    name: "Jordan Lee",
    initials: "JL",
    lastMessage: "Thanks, talk to you later!",
    timestamp: "10:12",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen today at 10:15",
    type: "direct",
  },
  {
    id: "conversation-4",
    name: "Michael Johnson",
    initials: "MJ",
    lastMessage: "That sounds like a great plan.",
    timestamp: "09:58",
    unread: 2,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-5",
    name: "Emily Williams",
    initials: "EW",
    lastMessage: "Can you review the latest version?",
    timestamp: "09:41",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen 1 hour ago",
    type: "direct",
  },
  {
    id: "conversation-6",
    name: "David Okafor",
    initials: "DO",
    lastMessage: "I'll call you when I get home.",
    timestamp: "09:18",
    unread: 3,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-7",
    name: "Olivia Martin",
    initials: "OM",
    lastMessage: "Perfect, thank you!",
    timestamp: "09:02",
    unread: 3,
    isOnline: false,
    lastSeen: "last seen today at 09:05",
    type: "direct",
  },
  {
    id: "conversation-8",
    name: "Daniel Kim",
    initials: "DK",
    lastMessage: "Did you get a chance to look at it?",
    timestamp: "08:47",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen 2 hours ago",
    type: "direct",
  },
  {
    id: "conversation-9",
    name: "Isabella Brown",
    initials: "IB",
    lastMessage: "Let's catch up this weekend.",
    timestamp: "08:26",
    unread: 3,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-10",
    name: "Christopher Anderson",
    initials: "CA",
    lastMessage: "The meeting notes are in the shared folder.",
    timestamp: "08:10",
    unread: 1,
    isOnline: false,
    lastSeen: "last seen today at 08:30",
    type: "direct",
  },
  {
    id: "conversation-11",
    name: "Sophia Martinez",
    initials: "SM",
    lastMessage: "I've added my feedback to the design.",
    timestamp: "Yesterday",
    unread: 3,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-12",
    name: "William Thompson",
    initials: "WT",
    lastMessage: "See you at the office on Monday.",
    timestamp: "Yesterday",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen yesterday at 22:14",
    type: "direct",
  },
  {
    id: "conversation-13",
    name: "Grace Nkem",
    initials: "GN",
    lastMessage: "The files uploaded successfully.",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: false,
    lastSeen: "last seen 3 hours ago",
    type: "direct",
  },
  {
    id: "conversation-14",
    name: "Benjamin Clark",
    initials: "BC",
    lastMessage: "Could you send me the updated link?",
    timestamp: "Yesterday",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen yesterday at 18:47",
    type: "direct",
  },
  {
    id: "conversation-15",
    name: "Amara Williams",
    initials: "AW",
    lastMessage: "That made my day 😂",
    timestamp: "Tue",
    unread: 3,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-16",
    name: "Samuel Peterson",
    initials: "SP",
    lastMessage: "Let me check and get back to you.",
    timestamp: "Tue",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen Tuesday at 16:20",
    type: "direct",
  },
  {
    id: "conversation-17",
    name: "Charlotte Evans",
    initials: "CE",
    lastMessage: "Are we still on for Saturday?",
    timestamp: "Tue",
    unread: 2,
    isOnline: false,
    lastSeen: "last seen 45 minutes ago",
    type: "direct",
  },
  {
    id: "conversation-18",
    name: "Nathan Williams",
    initials: "NW",
    lastMessage: "Thanks for explaining that so clearly.",
    timestamp: "Mon",
    unread: 1,
    isOnline: false,
    lastSeen: "last seen Monday at 20:05",
    type: "direct",
  },
  {
    id: "conversation-19",
    name: "Victoria James",
    initials: "VJ",
    lastMessage: "I've shared the presentation with you.",
    timestamp: "Mon",
    unread: 1,
    isOnline: true,
    lastSeen: null,
    type: "direct",
  },
  {
    id: "conversation-20",
    name: "Alexander Robertson",
    initials: "AR",
    lastMessage: "Let's discuss everything in more detail tomorrow.",
    timestamp: "Mon",
    unread: 3,
    isOnline: false,
    lastSeen: "last seen Monday at 11:32",
    type: "direct",
  },
];