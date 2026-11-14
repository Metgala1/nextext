import type { ConversationParticipant } from "@/data/conversation";
import { useState } from "react";

type CreateGroupDialogProps = {
  contacts: ConversationParticipant[];
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    participantIds: string[];
  }) => void;
};

export default function CreateGroupDialog({
  contacts,
  onClose,
  onCreate,
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);

  function handleToggleParticipant(participantId: string) {
    setSelectedParticipantIds((previousIds) =>
      previousIds.includes(participantId)
        ? previousIds.filter((id) => id !== participantId)
        : [...previousIds, participantId],
    );
  }

  function handleCreateGroup() {
    const trimmedName = groupName.trim();

    if (!trimmedName || selectedParticipantIds.length === 0) {
      return;
    }

    onCreate({
      name: trimmedName,
      description: groupDescription.trim(),
      participantIds: selectedParticipantIds,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              id="create-group-title"
              className="text-lg font-semibold text-foreground"
            >
              New group
            </h2>

            <p className="mt-1 text-sm text-secondary">
              Create a conversation with multiple people.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-elevated hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="group-name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Group name
            </label>

            <input
              id="group-name"
              type="text"
              placeholder="e.g. Weekend Plans"
              maxLength={40}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-xl border border-border bg-elevated px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="group-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Description{" "}
              <span className="font-normal text-secondary">(optional)</span>
            </label>

            <textarea
              id="group-description"
              placeholder="What's this group about?"
              rows={3}
              maxLength={120}
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-elevated px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus:border-accent"
            />
          </div>
        </div>

        <p className="text-sm text-secondary">
          {contacts.length} contacts available
        </p>

        <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
          {contacts.map((contact) => {
            const isSelected = selectedParticipantIds.includes(contact.id);

            return (
              <button
                key={contact.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleToggleParticipant(contact.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  isSelected ? "bg-accent/10" : "hover:bg-elevated"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-sm font-semibold text-foreground">
                  {contact.initials}
                </div>

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {contact.name}
                </span>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-border"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-secondary">
            {selectedParticipantIds.length} selected
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-elevated hover:text-foreground"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={
                !groupName.trim() || selectedParticipantIds.length === 0
              }
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}