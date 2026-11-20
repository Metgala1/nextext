
"use client";

import { RadioTower, Plus, Users, ChevronRight } from "lucide-react";
import type { BroadcastList } from "@/data/broadcast";

type BroadcastListScreenProps = {
  broadcastLists: BroadcastList[];
  onCreateBroadcast: () => void;
  onSelectBroadcast: (broadcastId: string) => void;
};

export default function BroadcastListScreen({
  broadcastLists,
  onCreateBroadcast,
  onSelectBroadcast,
}: BroadcastListScreenProps) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Broadcast
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Send messages to multiple contacts privately.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateBroadcast}
          className="flex items-center gap-2 rounded-default bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus size={17} />
          New broadcast
        </button>
      </header>

      {/* Broadcast lists */}
      <div className="flex-1 overflow-y-auto p-6">
        {broadcastLists.length === 0 ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <RadioTower size={30} strokeWidth={1.6} />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              No broadcast lists yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Create a broadcast list to send the same message
              privately to multiple contacts.
            </p>

            <button
              type="button"
              onClick={onCreateBroadcast}
              className="mt-6 flex items-center gap-2 rounded-default bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus size={17} />
              Create your first list
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {broadcastLists.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => onSelectBroadcast(list.id)}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-elevated"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <RadioTower size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {list.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                    <Users size={13} />
                    {list.recipientIds.length} recipients
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 text-text-secondary"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
