"use client";

import { ArrowLeft, RadioTower, Users } from "lucide-react";
import type { BroadcastList } from "@/data/broadcast";
import type { ConversationParticipant } from "@/data/conversation";

type BroadcastDetailScreenProps = {
  broadcast: BroadcastList;
  recipients: ConversationParticipant[];
  onBack: () => void;
};

export default function BroadcastDetailScreen({
  broadcast,
  recipients,
  onBack,
}: BroadcastDetailScreenProps) {
  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center gap-4 border-b border-border px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to broadcast lists"
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <RadioTower size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {broadcast.name}
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            {recipients.length} {recipients.length === 1 ? "recipient" : "recipients"}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center gap-2">
            <Users size={17} className="text-text-secondary" />

            <h2 className="text-sm font-semibold text-foreground">
              Recipients
            </h2>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-foreground">
                  {recipient.initials}
                </div>

                <span className="text-sm font-medium text-foreground">
                  {recipient.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}