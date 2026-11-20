"use client";

import { Plus, Image as ImageIcon, Video, Settings2 } from "lucide-react";
import type { UserStatusGroup } from "@/data/status";
import { hasUnviewedStatus } from "@/lib/status-utils";

type StatusListScreenProps = {
  statusGroups: UserStatusGroup[];
  currentUserId: string;
  onCreateStatus: () => void;
  onSelectStatus: (group: UserStatusGroup) => void;
  onOpenPrivacy: () => void;
};

function getLatestStatusTime(group: UserStatusGroup) {
  const latestUpdate = group.updates[group.updates.length - 1];

  return new Date(latestUpdate.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StatusListScreen({
  statusGroups,
  currentUserId,
  onCreateStatus,
  onSelectStatus,
  onOpenPrivacy,
}: StatusListScreenProps) {
  const myStatus = statusGroups.find((group) => group.isCurrentUser);

  const contactStatuses = statusGroups.filter(
    (group) => !group.isCurrentUser
  );

  const recentStatuses = contactStatuses.filter((group) =>
    hasUnviewedStatus(group, currentUserId)
  );

  const viewedStatuses = contactStatuses.filter(
    (group) => !hasUnviewedStatus(group, currentUserId)
  );

  function renderStatusGroup(group: UserStatusGroup) {
    const hasUnviewed = hasUnviewedStatus(group, currentUserId);
    const latestUpdate = group.updates[group.updates.length - 1];

    return (
      <button
        key={group.authorId}
        type="button"
        onClick={() => onSelectStatus(group)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-surface-elevated"
      >
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-full p-[2px] ${
            hasUnviewed ? "bg-accent" : "bg-text-secondary/40"
          }`}
        >
          <div className="flex size-full items-center justify-center rounded-full bg-surface text-sm font-semibold text-foreground">
            {group.authorInitials}
          </div>
        </div>

        <div className="min-w-0 flex-1 border-b border-border/60 pb-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {group.authorName}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
            {latestUpdate.type === "image" && <ImageIcon size={13} />}
            {latestUpdate.type === "video" && <Video size={13} />}

            <span>{getLatestStatusTime(group)}</span>
          </div>
        </div>

        <span className="text-xs text-text-secondary">
          {group.updates.length}{" "}
          {group.updates.length === 1 ? "update" : "updates"}
        </span>
      </button>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">Status</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Share moments and see what your contacts are up to.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPrivacy}
          aria-label="Status privacy settings"
          title="Status privacy"
          className="shrink-0 rounded-lg p-2 text-[#a3aab3] transition hover:bg-white/10 hover:text-white"
        >
          <Settings2 size={20} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section>
          <h2 className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            My status
          </h2>

          <button
            type="button"
            onClick={() => {
              if (myStatus) {
                onSelectStatus(myStatus);
              } else {
                onCreateStatus();
              }
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-surface-elevated"
          >
            <div
              className={`relative flex size-12 shrink-0 items-center justify-center rounded-full p-[2px] text-sm font-semibold ${
                myStatus ? "bg-accent" : "bg-surface-elevated"
              }`}
            >
              <div className="flex size-full items-center justify-center rounded-full bg-surface text-foreground">
                ME
              </div>

              <span
                role="button"
                aria-label="Add status"
                onClick={(event) => {
                  event.stopPropagation();
                  onCreateStatus();
                }}
                className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-accent text-white"
              >
                <Plus size={13} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                My status
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {myStatus
                  ? `${myStatus.updates.length} updates · Tap to view`
                  : "Tap to add a status update"}
              </p>
            </div>
          </button>
        </section>

        {recentStatuses.length > 0 && (
          <section className="mt-6">
            <h2 className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Recent updates
            </h2>

            {recentStatuses.map(renderStatusGroup)}
          </section>
        )}

        {viewedStatuses.length > 0 && (
          <section className="mt-6">
            <h2 className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Viewed updates
            </h2>

            {viewedStatuses.map(renderStatusGroup)}
          </section>
        )}

        {contactStatuses.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              No updates yet
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              When your contacts share updates, they&apos;ll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}