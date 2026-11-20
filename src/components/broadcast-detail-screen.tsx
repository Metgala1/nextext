"use client";
import { ArrowLeft, RadioTower, Users, Pencil, Trash2 } from "lucide-react";
import type { BroadcastList } from "@/data/broadcast";
import type { ConversationParticipant } from "@/data/conversation";
import type { BroadcastMessage } from "@/data/broadcast";
import BroadcastMessageList from "@/components/broadcast-message-list";
import BroadcastComposer from "@/components/broadcast-composer";

type BroadcastDetailScreenProps = {
  broadcast: BroadcastList;
  recipients: ConversationParticipant[];
  messages: BroadcastMessage[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
  onRename: () => void;
  onManageRecipients: () => void;
  onDelete: () => void;
};

export default function BroadcastDetailScreen({
  broadcast,
  recipients,
  onBack,
  onSendMessage,
  messages,
  onRename,
  onManageRecipients,
  onDelete
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
        <button
        type="button"
        onClick={onRename}
        aria-label="Rename broadcast list"
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
        <Pencil size={17} />
        </button>

        <button
            type="button"
            onClick={onDelete}
            aria-label="Delete broadcast list"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
            <Trash2 size={17} />
        </button>

        <button
        type="button"
        onClick={onManageRecipients}
        aria-label="Manage broadcast recipients"
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
        <Users size={17} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <BroadcastMessageList messages={messages} />

        <div className="border-t border-border px-6 py-3">
            <p className="text-xs text-text-secondary">
            Sending to {recipients.length}{" "}
            {recipients.length === 1 ? "recipient" : "recipients"}
            </p>
        </div>

        <BroadcastComposer
            onSend={onSendMessage}
            disabled={recipients.length === 0}
        />
        </div>
    </section>
  );
}