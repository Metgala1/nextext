"use client";

import { Pin, X , PinOff } from "lucide-react";
import type { Message } from "@/data/messages";

type PinnedMessagesPanelProps = {
    messages: Message[];
    contactName: string;
    onClose: () => void;
    onSelectMessage: (messageId: string) => void;
    onUnpin: (messageId: string) => void;
};

function formatPinnedDate(date: string) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export default function PinnedMessagesPanel({
    messages,
    contactName,
    onClose,
    onSelectMessage,
    onUnpin
}: PinnedMessagesPanelProps) {
    return (
        <div
            role="region"
            aria-label="Pinned messages panel"
            className="border-b border-border bg-surface"
        >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div>
                    <h3 className="text-sm font-semibold text-text">
                        Pinned messages
                    </h3>

                    <p className="text-xs text-text-secondary">
                        {messages.length} pinned{" "}
                        {messages.length === 1 ? "message" : "messages"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-elevated hover:text-text"
                    aria-label="Close pinned messages"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                        <Pin size={22} className="mb-3 text-text-secondary" />

                        <p className="text-sm font-medium text-text">
                            No pinned messages
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Messages you pin in this conversation will appear here.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-start gap-3 border-b border-border px-5 py-3 transition-colors hover:bg-elevated"
                        >
                            <button
                                type="button"
                                onClick={() => onSelectMessage(message.id)}
                                className="flex min-w-0 flex-1 items-start gap-3 text-left"
                            >
                                <Pin
                                    size={16}
                                    className="mt-1 shrink-0 text-accent"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 text-sm text-text">
                                        {message.text}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-text-secondary">
                                        <span>
                                            {message.sender === "me" ? "You" : contactName}
                                        </span>

                                        {message.pinnedAt && (
                                            <>
                                                <span aria-hidden="true">·</span>
                                                <span>
                                                    Pinned {formatPinnedDate(message.pinnedAt)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => onUnpin(message.id)}
                                className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-background hover:text-text"
                                aria-label="Unpin message"
                                title="Unpin message"
                            >
                                <PinOff size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}