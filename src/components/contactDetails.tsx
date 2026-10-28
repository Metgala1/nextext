
import { X } from "lucide-react";

type ContactDetailsProps = {
  name: string;
  initials: string;
  onClose: () => void;
};

export default function ContactDetails({
  name,
  initials,
  onClose,
}: ContactDetailsProps) {
  return (
    <aside
      aria-label="Contact details"
      className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-surface"
    >
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border px-5">
        <h2 className="text-sm font-semibold">
          Contact details
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact details"
          className="flex size-9 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-col items-center gap-3 border-b border-border px-5 py-8">
        <div
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-lg font-semibold text-accent"
        >
          {initials}
        </div>

        <h3 className="text-base font-semibold">
          {name}
        </h3>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Contact information
        </h3>

        <p className="text-sm leading-6 text-text-secondary">
          Additional contact information will appear here when available.
        </p>
      </div>
    </aside>
  );
}
