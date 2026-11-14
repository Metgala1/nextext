
"use client";

import { useState } from "react";
import type { ConversationParticipant } from "@/data/conversation";

type AddGroupMembersDialogProps = {
  contacts: ConversationParticipant[];
  existingMemberIds: string[];
  onClose: () => void;
  onAddMembers: (participantIds: string[]) => void;
};

export default function AddGroupMembersDialog({
  contacts,
  existingMemberIds,
  onClose,
  onAddMembers,
}: AddGroupMembersDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableContacts = contacts.filter(
    (contact) => !existingMemberIds.includes(contact.id)
  );

  function handleToggleContact(contactId: string) {
    setSelectedIds((previous) =>
      previous.includes(contactId)
        ? previous.filter((id) => id !== contactId)
        : [...previous, contactId]
    );
  }

  function handleSubmit() {
    if (selectedIds.length === 0) return;

    onAddMembers(selectedIds);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-members-title"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2
              id="add-members-title"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Add members
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary)]">
              Select people to add to this group.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg px-3 py-2 text-sm text-[var(--secondary)] transition-colors hover:bg-[var(--elevated)]"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {availableContacts.length > 0 ? (
            availableContacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);

              return (
                <label
                  key={contact.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--elevated)]"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleContact(contact.id)}
                    className="h-4 w-4 accent-[#4BA6C6]"
                  />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--elevated)] text-sm font-semibold text-[var(--foreground)]">
                    {contact.initials}
                  </div>

                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {contact.name}
                  </span>
                </label>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-[var(--secondary)]">
              Everyone in your contacts is already in this group.
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-[var(--secondary)] transition-colors hover:bg-[var(--elevated)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="rounded-lg bg-[#4BA6C6] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add {selectedIds.length > 0 ? selectedIds.length : ""} members
          </button>
        </div>
      </section>
    </div>
  );
}
