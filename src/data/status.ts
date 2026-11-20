export type StatusType = "text" | "image" | "video";

export type StatusUpdate = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  type: StatusType;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  expiresAt: string;
  viewedBy: string[];
  reactions?: StatusReaction[];
  background?: StatusBackground;
};

export type StatusReaction = {
  userId: string;
  emoji: string;
};

export type StatusBackground = {
  background: string;
  foreground: string;

};

export type UserStatusGroup = {
  authorId: string;
  authorName: string;
  authorInitials: string;
  isCurrentUser: boolean;
  updates: StatusUpdate[];
};
