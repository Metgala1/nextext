export type User = {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
};

export const CURRENT_USER_ID = "current-user";

export const CURRENT_USER: User = {
  id: CURRENT_USER_ID,
  name: "You",
  initials: "ME",
};

export const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    initials: "SC",
  },
  {
    id: "user-2",
    name: "Michael Johnson",
    initials: "MJ",
  },
  {
    id: "user-3",
    name: "Daniel Kim",
    initials: "DK",
  },
  {
    id: "user-4",
    name: "Grace Nkem",
    initials: "GN",
  },
  {
    id: "user-5",
    name: "David Okafor",
    initials: "DO",
  },
];