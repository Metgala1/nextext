
"use client";

import { useState } from "react";
import { X, Search, Users } from "lucide-react";
import type { ConversationParticipant } from "@/data/conversation";

type CreateBroadcastDialogProps = {
  isOpen: boolean;
  contacts: ConversationParticipant[];
  onClose: () => void;
  onCreate: (name: string, recipientIds: string[]) => void;
};

export default function CreateBroadcastDialog({
  isOpen,
  contacts,
  onClose,
  onCreate,
}: CreateBroadcastDialogProps) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    setSelectedIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreate = () => {
    const trimmedName = name.trim();

    if (!trimmedName || selectedIds.length === 0) return;

    onCreate(trimmedName, selectedIds);

    setName("");
    setSearch("");
    setSelectedIds([]);
  };

  const handleClose = () => {
    setName("");
    setSearch("");
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Create broadcast
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Choose who receives your broadcasts.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-elevated"
          >
            <X size={19} />
          </button>
        </header>

        <div className="space-y-4 p-5">
          <input
            type="text"
            value={name}
            maxLength={50}
            onChange={(event) => setName(event.target.value)}
            placeholder="Broadcast list name"
            className="w-full rounded-lg border border-border bg-elevated px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
          />

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts"
              className="w-full rounded-lg border border-border bg-elevated py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Select recipients</span>
            <span>{selectedIds.length} selected</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border-t border-border">
          {filteredContacts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-text-secondary">
              No contacts found.
            </p>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);

              return (
                <label
                  key={contact.id}
                  className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-elevated"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleContact(contact.id)}
                    className="size-4 accent-accent"
                  />

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {contact.initials}
                  </div>

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {contact.name}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border p-5">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Users size={15} />
            {selectedIds.length} recipients
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-elevated"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim() || selectedIds.length === 0}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create list
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
