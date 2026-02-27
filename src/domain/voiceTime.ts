export function createUser(id: string): User {
  return {
    id,
    lastJoinedAt: Date.now(),
    cumulative: 0,
    totalCumulative: 0,
  };
}

export function stampJoin(user: User): User {
  return { ...user, lastJoinedAt: Date.now() };
}

export function accumulateSession(user: User, preserveTimestamp = false): User {
  const now = Date.now();
  const duration = now - user.lastJoinedAt;

  return {
    ...user,
    cumulative: user.cumulative + duration,
    lastJoinedAt: preserveTimestamp ? now : -1,
  };
}

export function resetDaily(user: User): User {
  return {
    ...user,
    totalCumulative: user.totalCumulative + user.cumulative,
    cumulative: 0,
  };
}

export function isActive(user: User): boolean {
  return user.lastJoinedAt !== -1;
}
