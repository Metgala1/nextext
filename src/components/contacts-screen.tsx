"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Info, Search, UserRound, X } from "lucide-react";

import type { DirectConversation } from "@/data/conversation";

type ContactsScreenProps = {
  contacts: DirectConversation[];
  onSelectContact: (conversationId: string) => void;
  onViewDetails: (contact: DirectConversation) => void;
};

function getGroupLetter(name: string) {
  const first = name
    .trim()
    .charAt(0)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  return /^[A-Z]$/.test(first) ? first : "#";
}

function pluralizeContacts(count: number) {
  return `${count} ${count === 1 ? "contact" : "contacts"}`;
}

export default function ContactsScreen({
  contacts,
  onSelectContact,
  onViewDetails,
}: ContactsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedQuery = searchQuery.trim();

  const filteredContacts = useMemo(() => {
    const query = trimmedQuery.toLowerCase();

    const matches = query
      ? contacts.filter((contact) =>
          contact.name.toLowerCase().includes(query)
        )
      : contacts;

    return [...matches].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [contacts, trimmedQuery]);

  const groupedContacts = useMemo(() => {
    const groups = new Map<string, DirectConversation[]>();

    for (const contact of filteredContacts) {
      const letter = getGroupLetter(contact.name);
      const group = groups.get(letter);

      if (group) {
        group.push(contact);
      } else {
        groups.set(letter, [contact]);
      }
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      })
      .map(([letter, items]) => ({ letter, contacts: items }));
  }, [filteredContacts]);

  const hasNoContacts = contacts.length === 0;
  const isSearching = trimmedQuery.length > 0;

  return (
    <section
      aria-labelledby="contacts-heading"
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background"
    >
      <header className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-surface-elevated text-foreground">
            <UserRound size={20} aria-hidden="true" />
          </div>

          <div>
            <h1
              id="contacts-heading"
              className="text-lg font-semibold text-foreground"
            >
              Contacts
            </h1>

            <p
              className="mt-0.5 text-sm text-text-secondary"
              aria-live="polite"
            >
              {isSearching
                ? `${filteredContacts.length} of ${pluralizeContacts(contacts.length)}`
                : pluralizeContacts(contacts.length)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 transition-colors focus-within:border-accent">
          <Search
            size={18}
            aria-hidden="true"
            className="shrink-0 text-text-secondary"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search contacts"
            aria-label="Search contacts"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:appearance-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {groupedContacts.length > 0 ? (
          <div className="pb-4">
            {groupedContacts.map((group) => (
              <section key={group.letter} aria-label={`Contacts ${group.letter}`}>
                <h2 className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary backdrop-blur">
                  {group.letter}
                </h2>

                <ul className="divide-y divide-border">
                  {group.contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="group flex items-center gap-2 px-6 transition-colors hover:bg-surface focus-within:bg-surface"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectContact(contact.id)}
                        aria-label={`Open conversation with ${contact.name}`}
                        className="flex min-w-0 flex-1 items-center gap-4 rounded-md py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-foreground">
                          {contact.initials}

                          {contact.isOnline && (
                            <span
                              aria-hidden="true"
                              className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background bg-emerald-500"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {contact.name}
                          </p>

                          <p
                            className={`mt-1 truncate text-xs ${
                              contact.isOnline
                                ? "text-emerald-500"
                                : "text-text-secondary"
                            }`}
                          >
                            {contact.isOnline
                              ? "Online"
                              : contact.lastSeen || "Offline"}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewDetails(contact)}
                        aria-label={`View details for ${contact.name}`}
                        title="Contact details"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                      >
                        <Info size={18} aria-hidden="true" />
                      </button>

                      <ChevronRight
                        size={16}
                        aria-hidden="true"
                        className="hidden shrink-0 text-text-secondary md:block"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface">
              <UserRound
                size={26}
                aria-hidden="true"
                className="text-text-secondary"
              />
            </div>

            <h2 className="text-base font-medium text-foreground">
              {hasNoContacts ? "No contacts yet" : "No contacts found"}
            </h2>

            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              {hasNoContacts
                ? "People you connect with will appear here."
                : `No contacts match "${trimmedQuery}". Check the spelling or try another name.`}
            </p>

            {!hasNoContacts && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}