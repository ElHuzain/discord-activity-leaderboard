import { getStore, markDirty } from "./persistence";

export function save(user: User): void {
  const store = getStore();
  const index = store.findIndex((u) => u.id === user.id);

  if (index !== -1) {
    store[index] = { ...user };
  } else {
    store.push({ ...user });
  }

  markDirty();
}

export function getById(userId: string): User | null {
  const user = getStore().find((u) => u.id === userId);
  return user ? { ...user } : null;
}

export function getActiveUsers(): User[] {
  return getStore()
    .filter((u) => u.voice.lastJoinedAt !== -1)
    .map((u) => ({ ...u }));
}

export function getUsersWithCumulative(): User[] {
  return getStore()
    .filter((u) => u.voice.cumulative > 0)
    .map((u) => ({ ...u }));
}

export function getTopUsers(limit: number): User[] {
  return [...getStore()]
    .filter((u) => u.voice.cumulative > 0)
    .sort((a, b) => b.voice.cumulative - a.voice.cumulative)
    .slice(0, limit)
    .map((u) => ({ ...u }));
}
