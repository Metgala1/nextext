import { UserRound, Users, ChevronRight } from "lucide-react";

type NewConversationDialogProps = {
  onClose: () => void;
  onSelectType: (type: "direct" | "group") => void;
};

export default function NewConversationDialog({
  onClose,
  onSelectType,
}: NewConversationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="new-conversation-title"
              className="text-lg font-semibold text-foreground"
            >
              New conversation
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              What type of conversation would you like to create?
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

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onSelectType("direct")}
            className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:border-accent hover:bg-surface-elevated"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-accent">
              <UserRound size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                Direct conversation
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Start a private conversation with one person.
              </p>
            </div>

            <ChevronRight size={18} className="shrink-0 text-text-secondary" />
          </button>

          <button
            type="button"
            onClick={() => onSelectType("group")}
            className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:border-accent hover:bg-surface-elevated"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-accent">
              <Users size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                Group conversation
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Bring multiple people together in one conversation.
              </p>
            </div>

            <ChevronRight size={18} className="shrink-0 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
