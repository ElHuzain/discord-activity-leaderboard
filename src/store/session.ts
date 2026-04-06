import * as sessionStore from "./persistence/session";
import * as archivedSessionStore from "./persistence/archived-session";

export function save(session: Session): void {
  const store = sessionStore.getStore();

  store.push(session);

  sessionStore.markDirty();
}

export function getBetween({
  start = -Infinity,
  end = Infinity,
}: {
  start?: number;
  end?: number;
}): Session[] {
  const store = sessionStore.getStore();

  return store
    .filter((session) => session.joinedAt <= end && session.leftAt >= start)
    .map((session) => ({
      ...session,
      joinedAt: Math.max(start, session.joinedAt),
      leftAt: Math.min(end, session.leftAt),
    }));
}

export async function archiveOlderThan(timestamp: number): Promise<void> {
  const sessions = sessionStore.getStore();

  const archived: Session[] = [];

  // potential bug in the future: this reverts order of sessions
  // while currently doesnt matter, im just keeping it in mind
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].leftAt < timestamp) {
      archived.push({ ...sessions[i], isArchived: true });
      sessions.splice(i, 1);
    }
  }

  if (archived.length === 0) return;

  sessionStore.persist(true);
  await archivedSessionStore.save(archived);
}
