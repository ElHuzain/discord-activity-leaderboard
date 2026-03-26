import { getTimeFromMs, formatTime } from "../lib/helper";

export function startSession(user: User): User {
  return { ...user, lastJoinedAt: Date.now() };
}

export function hasActiveSession(user: User): boolean {
  return user.lastJoinedAt !== null;
}

export function endSession(user: User): { user: User; session: Session } {
  if (!hasActiveSession(user)) {
    throw new Error(
      "An attempt to create a session for a user without lastJoinedAt",
    );
  }

  return {
    user: {
      ...user,
      lastJoinedAt: null,
    },
    session: {
      joinedAt: user.lastJoinedAt!,
      leftAt: Date.now(),
      userId: user.id,
    },
  };
}

export function prepareTopUsers(sessions: Session[], limit?: number): TopUser[] {
  const userStats: Record<string, { time: number; sessions: number }> = {};
  for (const session of sessions) {
    if (!userStats[session.userId]) {
      userStats[session.userId] = { time: 0, sessions: 0 };
    }
    userStats[session.userId].time += session.leftAt - session.joinedAt;
    userStats[session.userId].sessions += 1;
  }

  let sortedUsers = Object.entries(userStats).sort((a, b) => b[1].time - a[1].time);

  if (limit && limit > 0) {
    sortedUsers = sortedUsers.slice(0, limit);
  }

  return sortedUsers.map(([id, stats]) => {
    const { hours, minutes, seconds } = getTimeFromMs(stats.time);
    return {
      id,
      formattedTime: formatTime(hours, minutes, seconds),
      sessions: stats.sessions,
    };
  });
}
