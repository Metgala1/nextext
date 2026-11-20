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
};

export type UserStatusGroup = {
  authorId: string;
  authorName: string;
  authorInitials: string;
  isCurrentUser: boolean;
  updates: StatusUpdate[];
};
