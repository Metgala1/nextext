
"use client";

import { ArrowLeft, Eye } from "lucide-react";
import type { StatusUpdate } from "@/data/status";
import { sampleUsers } from "@/data/users";

type StatusViewersPanelProps = {
  status: StatusUpdate;
  onBack: () => void;
};

export default function StatusViewersPanel({
  status,
  onBack,
}: StatusViewersPanelProps) {
  const viewers = status.viewedBy.map((viewerId) => {
    return (
      sampleUsers.find((user) => user.id === viewerId) ?? {
        id: viewerId,
        name: "Unknown user",
        initials: "??",
      }
    );
  });

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to status"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Viewed by
          </h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            {viewers.length} {viewers.length === 1 ? "viewer" : "viewers"}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {viewers.length > 0 ? (
          <div className="space-y-2">
            {viewers.map((viewer) => (
              <div
                key={viewer.id}
                className="flex items-center gap-3 rounded-xl px-3 py-3"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-foreground">
                  {viewer.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {viewer.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Viewed your status
                  </p>
                </div>

                <Eye size={16} className="text-text-secondary" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-surface-elevated">
              <Eye size={21} className="text-text-secondary" />
            </div>

            <p className="mt-4 text-sm font-medium text-foreground">
              No views yet
            </p>

            <p className="mt-1 max-w-xs text-xs text-text-secondary">
              When someone views this update, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
