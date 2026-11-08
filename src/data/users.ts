export type User  = {
    id: string;
    name: string;
    initials: string;
    avatarUrl?: string
}

export const CURRENT_USER_ID = "current-user"

export const CURRENT_USER: User = {
    id: CURRENT_USER_ID,
    name: "You",
    initials: "ME"
}