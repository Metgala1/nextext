"use client";

import { RadioTower } from "lucide-react";
import type { BroadcastMessage } from "@/data/broadcast";

type BroadcastMessageListProps = {
  messages: BroadcastMessage[];
};

export default function BroadcastMessageList({
  messages,
}: BroadcastMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-surface-elevated">
            <RadioTower size={25} className="text-text-secondary" />
          </div>

          <h2 className="text-base font-semibold text-foreground">
            No broadcast messages yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Messages you send to this list will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.map((message) => (
        <div key={message.id} className="flex justify-end">
          <div className="max-w-[75%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-white">
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.text}
            </p>

            <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-white/75">
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span>
                Sent to {message.recipientIds.length}{" "}
                {message.recipientIds.length === 1 ? "recipient" : "recipients"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}