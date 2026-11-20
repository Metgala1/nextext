import type { StatusUpdate, UserStatusGroup } from "@/data/status";

export function groupStatusUpdates(
  updates: StatusUpdate[],
  currentUserId: string,
  currentTime: number,
): UserStatusGroup[] {
  const activeUpdates = updates.filter(
    (update) => new Date(update.expiresAt).getTime() > currentTime,
  );

  const groups = new Map<string, UserStatusGroup>();

  for (const update of activeUpdates) {
    const existingGroup = groups.get(update.authorId);

    if (existingGroup) {
      existingGroup.updates.push(update);
      continue;
    }

    groups.set(update.authorId, {
      authorId: update.authorId,
      authorName: update.authorName,
      authorInitials: update.authorInitials,
      isCurrentUser: update.authorId === currentUserId,
      updates: [update],
    });
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    updates: group.updates.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
  }));
}

export function hasUnviewedStatus(
  group: UserStatusGroup,
  currentUserId: string,
): boolean {
  return group.updates.some(
    (update) => !update.viewedBy.includes(currentUserId),
  );
}
