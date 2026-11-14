import { X, Users, UserPlus, UserMinus } from "lucide-react";
import type { ConversationParticipant } from "@/data/conversation";
import { CURRENT_USER_ID } from "@/data/users";

type GroupDetailsProps = {
  name: string;
  initials: string;
  description?: string;
  participants: ConversationParticipant[];
  createdBy: string;
  onClose: () => void;
  onAddMembers: () => void;
  onRemoveMember: (participantId: string) => void;
};

export default function GroupDetails({
  name,
  initials,
  description,
  participants,
  createdBy,
  onClose,
  onAddMembers,
  onRemoveMember
}: GroupDetailsProps) {
  const isCurrentUserAdmin = participants.some(
  (participant) =>
    participant.id === CURRENT_USER_ID && participant.role === "admin"
);
  return (
    <aside
      aria-label="Group details"
      className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-surface"
    >
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border px-5">
        <h2 className="text-sm font-semibold">
          Group details
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close group details"
          className="flex size-9 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-col items-center gap-3 border-b border-border px-5 py-8">
        <div
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-lg font-semibold text-accent"
        >
          {initials}
        </div>

        <h3 className="text-base font-semibold">
          {name}
        </h3>

        <p className="text-xs text-text-secondary">
          {participants.length} members
        </p>
      </div>

      <div className="border-b border-border p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          About
        </h3>

        <p className="text-sm leading-6 text-text-secondary">
          {description || "No group description yet."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Members
          </h3>
          
          <button
            type="button"
            onClick={onAddMembers}
            className="text-sm font-medium text-[#4BA6C6] transition-colors hover:text-[#69B9D4]"
            >
           <UserPlus className="h-4 w-4" aria-hidden="true" />
          </button>

          

          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Users size={14} />
            {participants.length}
          </span>

        </div>

        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-foreground">
                {participant.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {participant.name}
                </p>

                {participant.id === createdBy && (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Group creator
                  </p>
                )}
              </div>

              {participant.role === "admin" && (
                <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                  Admin
                </span>
              )}

              {isCurrentUserAdmin &&
                participant.id !== CURRENT_USER_ID &&
                participant.id !== createdBy && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(participant.id)}
                    className="text-sm font-medium text-red-500 transition-colors hover:text-red-400"
                  >
                   <UserMinus size={18} aria-hidden="true" />
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}