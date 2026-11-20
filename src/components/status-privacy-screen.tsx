"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Check,
  Users,
  UserX,
  UserCheck,
} from "lucide-react";
import type { StatusUpdate } from "@/data/status";
import type { StatusPrivacySettings } from "@/data/status";

type PrivacyContact = {
  id: string;
  name: string;
  initials: string;
};

type StatusPrivacyScreenProps = {
  settings: StatusPrivacySettings;
  contacts: PrivacyContact[];
  getVisibleStatuses: (viewerId: string) => StatusUpdate[];
  onSave: (settings: StatusPrivacySettings) => void;
  onBack: () => void;
};

const privacyOptions = [
  {
    mode: "my-contacts",
    title: "My contacts",
    description: "All your contacts can see your status updates.",
    icon: Users,
  },
  {
    mode: "my-contacts-except",
    title: "My contacts except…",
    description: "Choose people who won't see your status updates.",
    icon: UserX,
  },
  {
    mode: "only-share-with",
    title: "Only share with…",
    description: "Choose exactly who can see your status updates.",
    icon: UserCheck,
  },
] as const;

export default function StatusPrivacyScreen({
  settings,
  contacts,
  onSave,
  onBack,
  getVisibleStatuses,
}: StatusPrivacyScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewContactId, setPreviewContactId] = useState(
    contacts[0]?.id ?? "",
  );

  const [draftSettings, setDraftSettings] =
    useState<StatusPrivacySettings>(settings);

  function handleSave() {
    if (
      draftSettings.mode === "only-share-with" &&
      draftSettings.allowedContactIds.length === 0
    ) {
      return;
    }

    onSave(draftSettings);
    onBack();
  }

  function handleContactToggle(contactId: string) {
    const isExclusionMode = draftSettings.mode === "my-contacts-except";

    const selectedIds = isExclusionMode
      ? draftSettings.excludedContactIds
      : draftSettings.allowedContactIds;

    const updatedIds = selectedIds.includes(contactId)
      ? selectedIds.filter((id) => id !== contactId)
      : [...selectedIds, contactId];

    setDraftSettings((previous) => ({
      ...previous,
      excludedContactIds: isExclusionMode
        ? updatedIds
        : previous.excludedContactIds,
      allowedContactIds: isExclusionMode
        ? previous.allowedContactIds
        : updatedIds,
    }));
  }

  function handleModeChange(mode: StatusPrivacySettings["mode"]) {
    setDraftSettings((previous) => ({
      ...previous,
      mode,
    }));
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedContactIds =
    draftSettings.mode === "my-contacts-except"
      ? draftSettings.excludedContactIds
      : draftSettings.allowedContactIds;

  const showContactPicker = draftSettings.mode !== "my-contacts";

  const isInvalid =
    draftSettings.mode === "only-share-with" &&
    draftSettings.allowedContactIds.length === 0;

  const previewContact = contacts.find(
    (contact) => contact.id === previewContactId,
  );

  const visibleStatuses = previewContactId
    ? getVisibleStatuses(previewContactId)
    : [];

  return (
    <div className="flex h-full flex-col bg-[#0b0c0e] text-[#f2f4f6]">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="rounded-lg p-2 transition hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-lg font-semibold">Status privacy</h1>
          <p className="text-xs text-[#a3aab3]">
            Choose who can see your updates
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6">
        <p className="mb-5 text-sm text-[#a3aab3]">
          Your changes apply to future status updates. Previously published
          updates keep their existing audience.
        </p>

        <div className="space-y-2">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const selected = draftSettings.mode === option.mode;

            return (
              <button
                key={option.mode}
                type="button"
                onClick={() => handleModeChange(option.mode)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#4BA6C6] bg-[#4BA6C6]/10"
                    : "border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  size={21}
                  className={selected ? "text-[#4BA6C6]" : "text-[#a3aab3]"}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{option.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#a3aab3]">
                    {option.description}
                  </p>
                </div>

                <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/30">
                  {selected && <Check size={13} className="text-[#4BA6C6]" />}
                </div>
              </button>
            );
          })}
        </div>

        {showContactPicker && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">
                {draftSettings.mode === "my-contacts-except"
                  ? "Exclude contacts"
                  : "Share with"}
              </h2>

              <p className="mt-1 text-xs text-[#a3aab3]">
                {selectedContactIds.length} selected
              </p>

              {isInvalid && (
                <p className="mt-2 text-xs text-amber-400">
                  Select at least one contact to share your status.
                </p>
              )}
            </div>

            <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3">
              <Search size={17} className="text-[#a3aab3]" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search contacts"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#747d87]"
              />
            </div>

            <div className="divide-y divide-white/[0.06]">
              {filteredContacts.map((contact) => {
                const selected = selectedContactIds.includes(contact.id);

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleContactToggle(contact.id)}
                    aria-pressed={selected}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-white/[0.03]"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#252b31] text-xs font-semibold text-[#dce2e8]">
                      {contact.initials}
                    </div>

                    <span className="flex-1 text-sm font-medium">
                      {contact.name}
                    </span>

                    <div
                      className={`flex size-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#4BA6C6] bg-[#4BA6C6]"
                          : "border-white/30"
                      }`}
                    >
                      {selected && (
                        <Check size={13} className="text-[#0b0c0e]" />
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredContacts.length === 0 && (
                <p className="py-8 text-center text-sm text-[#a3aab3]">
                  No contacts found.
                </p>
              )}
            </div>
          </section>
        )}
        <section className="mt-8 border-t border-white/10 pt-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Status audience preview</h2>

            <p className="mt-1 text-xs text-[#a3aab3]">
              Check which of your published statuses a contact can see.
            </p>
          </div>

          <select
            value={previewContactId}
            onChange={(event) => setPreviewContactId(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#14171a] px-3 text-sm outline-none focus:border-[#4BA6C6]"
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>

          {previewContact && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {previewContact.name}
                </span>

                <span className="text-xs text-[#4BA6C6]">
                  {visibleStatuses.length} visible
                </span>
              </div>

              {visibleStatuses.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {visibleStatuses.map((status) => (
                    <div
                      key={status.id}
                      className="rounded-lg bg-white/[0.04] p-3"
                    >
                      <p className="text-xs text-[#a3aab3]">
                        {status.type} status
                      </p>

                      <p className="mt-1 text-sm">
                        {status.content || "Media status"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#a3aab3]">
                  This contact cannot see any of your active statuses.
                </p>
              )}
            </div>
          )}

          {contacts.length === 0 && (
            <p className="mt-3 text-xs text-[#a3aab3]">
              No contacts available for preview.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 p-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={isInvalid}
          className="w-full rounded-xl bg-[#4BA6C6] px-4 py-3 text-sm font-semibold text-[#0b0c0e] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save privacy settings
        </button>
      </footer>
    </div>
  );
}
