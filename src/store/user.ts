import { getStore, markDirty } from "./persistence/user";

export function save(user: User): void {
  const store = getStore();

  store[user.id] = { ...user };

  markDirty();
}

export function getById(userId: string): User | null {
  const user = getStore()[userId];

  return user ? { ...user } : null;
}

export function getActiveUsers(): User[] {
  const filtered = Object.values(getStore()).filter(
    (u) => u.lastJoinedAt !== null,
  );

  return filtered.map((u) => {
    return { ...u };
  });
}
