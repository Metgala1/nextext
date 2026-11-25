
"use client";

import { Mail, Phone, UserRound, X } from "lucide-react";

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
      className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-background"
    >
      {/* Header */}
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border px-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Contact information
          </h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Profile and details
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact details"
          className="flex size-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <X size={18} />
        </button>
      </header>

      {/* Profile */}
      <div className="flex flex-col items-center border-b border-border px-5 py-9">
        <div className="relative mb-4 flex size-24 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-2xl font-semibold tracking-wide text-accent">
          {initials}
        </div>

        <h3 className="max-w-full truncate text-lg font-semibold text-foreground">
          {name}
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Contact
        </p>
      </div>

      {/* Contact information */}
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Contact details
        </h3>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-secondary">
              <Phone size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-secondary">
                Phone number
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Not available
              </p>
            </div>
          </div>

          <div className="mx-4 border-t border-border" />

          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-secondary">
              <Mail size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-secondary">
                Email address
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Not available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="mt-auto border-t border-border p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-secondary">
            <UserRound size={17} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              Personal information
            </p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">
              More profile information will be available when this contact
              shares it.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
