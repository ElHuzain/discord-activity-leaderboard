import { ResultKind, XPDataType } from "../shared/enums";
import * as xp from "./xp";

export function stampJoin(user: User): User {
  return { ...user, voice: { ...user.voice, lastJoinedAt: Date.now() } };
}

export function accumulateSession(
  user: User,
  preserveTimestamp = false,
): Result {
  const now = Date.now();
  const duration = now - user.voice.lastJoinedAt;
  user.xp = xp.addXp(user.xp, duration, XPDataType.VOICE);
  const oldLevel = user.level;

  if (xp.canLevelUp(user)) {
    const newUser = xp.levelUp(user);

    return {
      user: newUser,
      kind: ResultKind.LEVEL_UP,
      oldLevel,
      newLevel: newUser.level,
    };
  }

  return {
    kind: ResultKind.NO_CHANGE,
    user: {
      ...user,
      voice: {
        ...user.voice,
        cumulative: user.voice.cumulative + duration,
        lastJoinedAt: preserveTimestamp ? now : -1,
      },
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
