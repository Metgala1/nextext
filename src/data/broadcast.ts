export type BroadcastList = {
  id: string;
  name: string;
  recipientIds: string[];
  createdAt: string;
};

export type BroadcastMessage = {
  id: string;
  broadcastId: string;
  text: string;
  timestamp: string;
  recipientIds: string[];
};

export function createBroadcastList({
  name,
  recipientIds,
}: {
  name: string;
  recipientIds: string[];
}): BroadcastList {
  return {
    id: crypto.randomUUID(),
    name,
    recipientIds,
    createdAt: new Date().toISOString(),
  };
}