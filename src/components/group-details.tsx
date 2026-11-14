import {
  X,
  Users,
  UserPlus,
  UserMinus,
  Pencil,
  LogOut,
  Bell,
  BellOff,
} from "lucide-react";

import { Search } from "lucide-react";
import { useState } from "react";

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
  onPromoteMember: (participantId: string) => void;
  onEditDescription: () => void;
  onEditPhoto: () => void;
  photoUrl?: string;
  onEditName: () => void;
  onLeaveGroup: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
};

export default function GroupDetails({
  name,
  initials,
  description,
  participants,
  createdBy,
  onClose,
  onAddMembers,
  onRemoveMember,
  onPromoteMember,
  onEditDescription,
  onEditPhoto,
  photoUrl,
  onEditName,
  onLeaveGroup,
  isMuted,
  onToggleMute,
}: GroupDetailsProps) {
  const isCurrentUserAdmin = participants.some(
    (participant) =>
      participant.id === CURRENT_USER_ID && participant.role === "admin",
  );

  const [participantSearch, setParticipantSearch] = useState("");
  const filteredParticipants = participants.filter((participant) =>
  participant.name
    .toLowerCase()
    .includes(participantSearch.trim().toLowerCase()));

  return (
    <aside
      aria-label="Group details"
      className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-surface"
    >
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border px-5">
        <h2 className="text-sm font-semibold">Group details</h2>

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
        <div className="mx-auto flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-2xl font-semibold text-foreground">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${name} group photo`}
              className="block size-full rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {createdBy === CURRENT_USER_ID && (
          <button
            type="button"
            onClick={onEditPhoto}
            className="mt-2 text-sm font-medium text-accent transition-colors hover:opacity-80"
          >
            Edit photo
          </button>
        )}

        <h3 className="text-base font-semibold">{name}</h3>

        {createdBy === CURRENT_USER_ID && (
          <button
            type="button"
            onClick={onEditName}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#4BA6C6] transition-colors hover:text-[#69B9D4]"
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </button>
        )}

        <p className="text-xs text-text-secondary">
          {participants.length} members
        </p>
      </div>

      <div className="border-b border-border px-5 py-3">
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={isMuted}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
        >
          {isMuted ? (
            <Bell size={16} aria-hidden="true" />
          ) : (
            <BellOff size={16} aria-hidden="true" />
          )}
          {isMuted ? "Unmute notifications" : "Mute notifications"}
        </button>
      </div>

      <div className="border-b border-border p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Description
          </h3>

          {createdBy === CURRENT_USER_ID && (
            <button
              type="button"
              onClick={onEditDescription}
              className="text-sm font-medium text-[#4BA6C6] transition-colors hover:text-[#69B9D4]"
            >
              Edit
            </button>
          )}
        </div>

        <p className="text-sm leading-6 text-text-secondary">
          {description || "No group description yet."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Members
          </h3>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Users size={14} aria-hidden="true" />
              {participants.length}
            </span>

            <button
              type="button"
              onClick={onAddMembers}
              aria-label="Add members"
              title="Add members"
              className="text-[#4BA6C6] transition-colors hover:text-[#69B9D4]"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
          <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          />

          <input
            type="text"
            value={participantSearch}
            onChange={(event) => setParticipantSearch(event.target.value)}
            placeholder="Search participants"
            className="w-full rounded-lg border border-border bg-elevated py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>

        {filteredParticipants.length === 0 && (
          <p className="py-6 text-center text-sm text-secondary">
            No participants found.
          </p>
        )}
        <div className="space-y-3">
          {filteredParticipants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3">
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

              {createdBy === CURRENT_USER_ID &&
                participant.id !== CURRENT_USER_ID &&
                participant.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => onPromoteMember(participant.id)}
                    className="text-sm font-medium text-[#4BA6C6] transition-colors hover:text-[#69B9D4]"
                  >
                    Make admin
                  </button>
                )}

              {isCurrentUserAdmin &&
                participant.id !== CURRENT_USER_ID &&
                participant.id !== createdBy && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(participant.id)}
                    aria-label={`Remove ${participant.name}`}
                    title="Remove member"
                    className="text-red-500 transition-colors hover:text-red-400"
                  >
                    <UserMinus size={18} aria-hidden="true" />
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>

      {createdBy !== CURRENT_USER_ID && (
        <div className="shrink-0 border-t border-border p-5">
          <button
            type="button"
            onClick={onLeaveGroup}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={16} aria-hidden="true" />
            Leave group
          </button>
        </div>
      )}
    </aside>
  );
}