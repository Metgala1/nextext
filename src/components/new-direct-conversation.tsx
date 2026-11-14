import type { ConversationParticipant } from "@/data/conversation";

type NewDirectConversationDialogProps = {
  contacts: ConversationParticipant[];
  onClose: () => void;
  onSelectContact: (contactId: string) => void;
};

export default function NewDirectConversationDialog({
  contacts,
  onClose,
  onSelectContact,
}: NewDirectConversationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-direct-conversation-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              id="new-direct-conversation-title"
              className="text-lg font-semibold text-foreground"
            >
              New direct conversation
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Choose someone to start a private chat with.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 space-y-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => onSelectContact(contact.id)}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-surface-elevated"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-foreground">
                {contact.initials}
              </div>

              <span className="flex-1 truncate text-sm font-medium text-foreground">
                {contact.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}