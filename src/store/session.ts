import { getStore, markDirty } from "./persistence/session";

export function save(session: Session): void {
  const store = getStore();

  store.push(session);

  markDirty();
}

export function getBetween({
  start,
  end,
}: {
  start?: number;
  end?: number;
}): Session[] {
  const store = getStore();

  if (start && !end) {
    return store.filter((session) => session.joinedAt <= start);
  }

  if (!start && end) {
    return store.filter((session) => end >= session.leftAt);
  }

  if (start && end) {
    return store.filter(
      (session) => end >= session.leftAt && session.joinedAt <= start,
    );
  }

  return [];
}

export function getWeek(): Session[] {
  return [];
}
