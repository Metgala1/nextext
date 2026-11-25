"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  Video,
  X,
  Clock,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import type { CallRecord } from "@/data/call";

type CallDetailsScreenProps = {
  call: CallRecord;
  onClose: () => void;
  onCall: (call: CallRecord) => void;
  onViewConversation: (conversationId: string) => void;
};

function formatDuration(seconds?: number) {
  if (seconds === undefined) return "Unavailable";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return minutes > 0
    ? `${minutes} min ${remainingSeconds} sec`
    : `${remainingSeconds} sec`;
}

export default function CallDetailsScreen({
  call,
  onClose,
  onCall,
  onViewConversation,
}: CallDetailsScreenProps) {
  const DirectionIcon =
    call.direction === "incoming" ? ArrowDownLeft : ArrowUpRight;

  const CallIcon = call.type === "video" ? Video : Phone;

  const callDate = new Date(call.startedAt);

  const formattedDate = Number.isNaN(callDate.getTime())
    ? "Unknown date"
    : callDate.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const formattedTime = Number.isNaN(callDate.getTime())
    ? "Unknown time"
    : callDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

  const callStatus =
    call.status === "missed"
      ? "Missed call"
      : call.status === "declined"
        ? "Declined call"
        : call.status === "completed"
          ? "Completed call"
          : call.status === "active"
            ? "Active call"
            : "Ringing";

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <h1 className="text-lg font-semibold text-foreground">
          Call details
        </h1>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close call details"
          className="flex size-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-10">
        <div className="flex size-20 items-center justify-center rounded-full bg-surface-elevated text-xl font-semibold text-foreground">
          {call.participantInitials}
        </div>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {call.participantName}
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          {callStatus}
        </p>

        {/* Actions */}
        <div className="mt-6 flex w-full max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => onCall(call)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Phone size={17} aria-hidden="true" />
            <span className="truncate">Call again</span>
          </button>

          <button
            type="button"
            onClick={() => onViewConversation(call.conversationId)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <MessageSquare size={17} aria-hidden="true" />
            <span className="truncate">View conversation</span>
          </button>
        </div>

        <div className="mt-10 w-full max-w-md divide-y divide-border rounded-xl border border-border">
          <div className="flex items-center gap-3 p-4">
            <CallIcon
              size={18}
              className="text-text-secondary"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-foreground">
                {call.type === "video" ? "Video call" : "Voice call"}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {call.direction === "incoming" ? "Incoming" : "Outgoing"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <CalendarDays
              size={18}
              className="text-text-secondary"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-foreground">
                {formattedDate}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <Clock
              size={18}
              className="text-text-secondary"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-foreground">
                Duration
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {formatDuration(call.duration)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <DirectionIcon
              size={18}
              className="text-text-secondary"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-foreground">
                Call direction
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {call.direction === "incoming"
                  ? "Incoming call"
                  : "Outgoing call"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}