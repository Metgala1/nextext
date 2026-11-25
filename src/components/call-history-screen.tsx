"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  Video,
  PhoneCall,
  Search,
  Trash2,
  Trash,
} from "lucide-react";

import { useState } from "react";
import type { CallRecord } from "@/data/call";

type CallFilter = "all" | "missed" | "incoming" | "outgoing";

type CallHistoryScreenProps = {
  calls: CallRecord[];
  onCall: (call: CallRecord) => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteCall: (callId: string) => void;
  onClearHistory: () => void;
};

function formatCallTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function formatDuration(seconds?: number) {
  if (seconds === undefined) return "";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return minutes > 0
    ? `${minutes} min ${remainingSeconds} sec`
    : `${remainingSeconds} sec`;
}

function getCallDateGroup(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "Earlier";
  }

  const startOfDay = (value: Date) =>
    new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );

  const today = startOfDay(now);
  const callDate = startOfDay(date);

  const differenceInDays = Math.floor(
    (today.getTime() - callDate.getTime()) / 86_400_000
  );

  if (differenceInDays < 0) return "Upcoming";
  if (differenceInDays === 0) return "Today";
  if (differenceInDays === 1) return "Yesterday";

  if (differenceInDays < 7) {
    return "This week";
  }

  return "Earlier";
}

const groupOrder = [
  "Upcoming",
  "Today",
  "Yesterday",
  "This week",
  "Earlier",
];

export default function CallHistoryScreen({
  calls,
  onCall,
  onSelectConversation,
  onDeleteCall,
  onClearHistory,
}: CallHistoryScreenProps) {
  const [activeFilter, setActiveFilter] = useState<CallFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = call.participantName
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesFilter = (() => {
      switch (activeFilter) {
        case "missed":
          return call.status === "missed";
        case "incoming":
          return call.direction === "incoming";
        case "outgoing":
          return call.direction === "outgoing";
        case "all":
        default:
          return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  const groupedCalls = filteredCalls.reduce<Record<string, CallRecord[]>>(
    (groups, call) => {
      const group = getCallDateGroup(call.startedAt);

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(call);

      return groups;
    },
    {}
  );

  const sortedGroups = groupOrder
    .filter((group) => groupedCalls[group]?.length)
    .map((group) => ({
      title: group,
      calls: groupedCalls[group],
    }));

  const filterCounts = {
    all: calls.length,
    missed: calls.filter((call) => call.status === "missed").length,
    incoming: calls.filter((call) => call.direction === "incoming").length,
    outgoing: calls.filter((call) => call.direction === "outgoing").length,
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Missed", value: "missed" },
    { label: "Incoming", value: "incoming" },
    { label: "Outgoing", value: "outgoing" },
  ] as const;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Calls</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Your recent calls
          </p>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          disabled={calls.length === 0}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Trash size={16} aria-hidden="true" />
          <span>Clear history</span>
        </button>
      </header>

      {/* Search */}
      <div className="border-b border-border px-6 pt-4">
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search call history..."
            aria-label="Search call history"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-secondary focus:border-accent"
          />
        </div>

        {/* Call filters */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeFilter === filter.value
                  ? "bg-surface-elevated text-foreground"
                  : "text-text-secondary hover:bg-surface hover:text-foreground"
              }`}
            >
              <span>{filter.label}</span>

              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-text-secondary">
                {filterCounts[filter.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Call history */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredCalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface">
              <PhoneCall
                size={24}
                className="text-text-secondary"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-base font-medium text-foreground">
              {calls.length === 0 ? "No calls yet" : "No matching calls"}
            </h2>

            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              {calls.length === 0
                ? "Your voice and video call history will appear here."
                : "No calls match your search or selected filter. Try another search or filter."}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            {sortedGroups.map((group) => (
              <section key={group.title}>
                <h2 className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary backdrop-blur">
                  {group.title}
                </h2>

                <div className="divide-y divide-border">
                  {group.calls.map((call) => {
                    const isMissed = call.status === "missed";
                    const isDeclined = call.status === "declined";

                    const DirectionIcon =
                      call.direction === "incoming"
                        ? ArrowDownLeft
                        : ArrowUpRight;

                    const CallIcon = call.type === "video" ? Video : Phone;

                    return (
                      <div
                        key={call.id}
                        className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-surface"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onSelectConversation(call.conversationId)
                          }
                          aria-label={`Open conversation with ${call.participantName}`}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-foreground">
                            {call.participantInitials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-sm font-medium ${
                                isMissed ? "text-red-500" : "text-foreground"
                              }`}
                            >
                              {call.participantName}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                              <DirectionIcon
                                size={14}
                                className={
                                  isMissed
                                    ? "text-red-500"
                                    : "text-text-secondary"
                                }
                                aria-hidden="true"
                              />

                              <span>
                                {call.direction === "incoming"
                                  ? "Incoming"
                                  : "Outgoing"}
                              </span>

                              <span aria-hidden="true">·</span>

                              <span>
                                {isMissed
                                  ? "Missed"
                                  : isDeclined
                                    ? "Declined"
                                    : formatDuration(call.duration)}
                              </span>
                            </div>
                          </div>
                        </button>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-xs text-text-secondary">
                            {formatCallTime(call.startedAt)}
                          </span>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <CallIcon
                                size={15}
                                aria-hidden="true"
                              />

                              <span>
                                {call.type === "video" ? "Video" : "Voice"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onCall(call)}
                              aria-label={`Call ${call.participantName}`}
                              className="flex size-9 items-center justify-center rounded-lg text-accent transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                              <Phone size={17} aria-hidden="true" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteCall(call.id)}
                              aria-label={`Delete call with ${call.participantName}`}
                              title="Delete call"
                              className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/5 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA6C6]"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}