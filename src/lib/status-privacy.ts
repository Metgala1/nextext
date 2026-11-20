import type { StatusPrivacySettings } from "@/data/status";

export function canViewStatus(
  contactId: string,
  privacy: StatusPrivacySettings,
): boolean {
  switch (privacy.mode) {
    case "my-contacts":
      return true;

    case "my-contacts-except":
      return !privacy.excludedContactIds.includes(contactId);

    case "only-share-with":
      return privacy.allowedContactIds.includes(contactId);

    default:
      return false;
  }
}
