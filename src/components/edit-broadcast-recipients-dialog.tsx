
"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import type { ConversationParticipant } from "@/data/conversation";

type EditBroadcastRecipientsDialogProps = {
  isOpen: boolean;
  contacts: ConversationParticipant[];
  selectedRecipientIds: string[];
  onClose: () => void;
  onSave: (recipientIds: string[]) => void;
};

export default function EditBroadcastRecipientsDialog({
  isOpen,
  contacts,
  selectedRecipientIds,
  onClose,
  onSave,
}: EditBroadcastRecipientsDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(selectedRecipientIds);
      setSearch("");
    }
  }, [isOpen, selectedRecipientIds]);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleRecipient(contactId: string) {
    setSelectedIds((previous) =>
      previous.includes(contactId)
        ? previous.filter((id) => id !== contactId)
        : [...previous, contactId]
    );
  }

  function handleSave() {
    if (selectedIds.length === 0) return;
    onSave(selectedIds);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-broadcast-recipients-title"
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="edit-broadcast-recipients-title"
              className="font-semibold text-foreground"
            >
              Manage recipients
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              {selectedIds.length} selected
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Search size={16} className="text-text-secondary" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-text-secondary"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filteredContacts.map((contact) => {
            const isSelected = selectedIds.includes(contact.id);

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => toggleRecipient(contact.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface-elevated"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-foreground">
                  {contact.initials}
                </div>

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {contact.name}
                </span>

                <span
                  className={`flex size-5 items-center justify-center rounded border ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-border"
                  }`}
                >
                  {isSelected && (
                    <span className="text-xs">✓</span>
                  )}
                </span>
              </button>
            );
          })}

          {filteredContacts.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">
              No contacts found.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedIds.length === 0}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save recipients
          </button>
        </div>
      </div>
    </div>
  );
}
