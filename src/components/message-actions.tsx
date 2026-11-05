"use client";

import {
  Copy,
  Forward,
  MoreHorizontal,
  Reply,
  SmilePlus,
  Star,
  Trash2,
  Pencil
} from "lucide-react";

export type MessageAction =
  | "reply"
  | "copy"
  | "react"
  | "star"
  | "forward"
  | "delete"
  | "edit";


type MessageActionsMenuProps = {
  onAction: (action: MessageAction) => void;
  isOwnMessage: boolean;
};

export default function MessageActionsMenu({
  onAction,
  isOwnMessage
}: MessageActionsMenuProps) {
  const actions = [
    { id: "reply", label: "Reply", icon: Reply },
    { id: "copy", label: "Copy", icon: Copy },
    { id: "react", label: "React", icon: SmilePlus },
    { id: "star", label: "Star", icon: Star },
    { id: "forward", label: "Forward", icon: Forward },
    { id: "delete", label: "Delete", icon: Trash2 },
    { id: "edit", label: "Edit", icon: Pencil },
  ] as const;

  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-50 mt-2 w-48 rounded-default border border-border bg-surface p-1 shadow-xl"
    >
      {actions.filter((action) => action.id !== "edit" || isOwnMessage).map((action) => {
        const Icon = action.icon;
        const isDelete = action.id === "delete";

        return (
          <button
            key={action.id}
            type="button"
            role="menuitem"
            onClick={() => onAction(action.id)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-surface-elevated ${
              isDelete
                ? "text-red-400"
                : "text-foreground"
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