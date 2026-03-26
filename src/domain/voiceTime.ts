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
