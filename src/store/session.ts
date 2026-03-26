import { getStore, markDirty } from "./persistence/session";
import * as archivedSessionStore from "./persistence/archived-session";

export function save(session: Session): void {
  const store = getStore();

  store.push(session);

  markDirty();
}

export function getBetween({
  start = -Infinity,
  end = Infinity,
}: {
  start?: number;
  end?: number;
}): Session[] {
  const store = getStore();

  return store
    .filter((session) => session.joinedAt <= end && session.leftAt >= start)
    .map((session) => ({
      ...session,
      joinedAt: Math.max(start, session.joinedAt),
      leftAt: Math.min(end, session.leftAt),
    }));
}

export async function archiveOlderThan(timestamp: number): Promise<void> {
  const store = getStore();

  const archived: Session[] = [];

  // potential bug in the future: this reverts order of sessions
  // while currently doesnt matter, im just keeping it in mind
  for (let i = store.length - 1; i >= 0; i--) {
    if (store[i].leftAt < timestamp) {
      archived.push({ ...store[i], isArchived: true });
      store.splice(i, 1);
    }
  }

  if (archived.length === 0) return;

  markDirty();
  await archivedSessionStore.save(archived);
}
