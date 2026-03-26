import { getStore, markDirty } from "./persistence/session";

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