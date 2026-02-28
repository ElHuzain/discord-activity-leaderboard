export function stampJoin(user: User): User {
  return { ...user, voice: { ...user.voice, lastJoinedAt: Date.now() } };
}

export function accumulateSession(user: User, preserveTimestamp = false): User {
  const now = Date.now();
  const duration = now - user.voice.lastJoinedAt;

  return {
    ...user,
    voice: {
      ...user.voice,
      cumulative: user.voice.cumulative + duration,
      lastJoinedAt: preserveTimestamp ? now : -1,
    },
  };
}

export function resetDaily(user: User): User {
  return {
    ...user,
    voice: {
      ...user.voice,
      totalCumulative: user.voice.totalCumulative + user.voice.cumulative,
      cumulative: 0,
    },
  };
}

export function isActive(user: User): boolean {
  return user.voice.lastJoinedAt !== -1;
}
