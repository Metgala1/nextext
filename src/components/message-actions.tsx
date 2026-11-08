"use client";

import {
  Copy,
  Forward,
  MoreHorizontal,
  Reply,
  SmilePlus,
  Star,
  Trash2,
  Pencil,
  Pin,
} from "lucide-react";

export type MessageAction =
  | "reply"
  | "copy"
  | "react"
  | "star"
  | "forward"
  | "delete"
  | "edit"
  | "pin"
  | "unpin";

type MessageActionsMenuProps = {
  onAction: (action: MessageAction) => void;
  isOwnMessage: boolean;
  isPinned: boolean;
};

export default function MessageActionsMenu({
  onAction,
  isOwnMessage,
  isPinned,
}: MessageActionsMenuProps) {
  const actions = [
    { id: "reply", label: "Reply", icon: Reply },
    { id: "copy", label: "Copy", icon: Copy },
    { id: "react", label: "React", icon: SmilePlus },
    { id: "star", label: "Star", icon: Star },
    { id: "forward", label: "Forward", icon: Forward },
    { id: "delete", label: "Delete", icon: Trash2 },
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "pin", label: "Pin", icon: Pin },
    { id: "unpin", label: "Unpin", icon: Pin },
  ] as const;

  const visibleActions = actions
    .filter((action) => action.id !== "edit" || isOwnMessage)
    .filter((action) => {
      if (action.id === "pin") return !isPinned;
      if (action.id === "unpin") return isPinned;
      return true;
    });

  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-50 mt-2 w-48 rounded-default border border-border bg-surface p-1 shadow-xl"
    >
      {visibleActions.map((action) => {
        const Icon = action.icon;
        const isDelete = action.id === "delete";

        return (
          <button
            key={action.id}
            type="button"
            role="menuitem"
            onClick={() => onAction(action.id)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface-elevated ${
              isDelete ? "text-red-400" : "text-foreground"
            }`}
          >
            <Icon size={16} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}