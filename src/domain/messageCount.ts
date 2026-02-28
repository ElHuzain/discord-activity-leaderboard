import { ResultKind, XPDataType } from "../shared/enums";
import * as xp from "./xp";

export function increment(user: User): Result {
  user.message.count++;
  user.xp = xp.addXp(user.xp, 1, XPDataType.MESSAGE);
  const oldLevel = user.level;

  if (xp.canLevelUp(user)) {
    const newUser = xp.levelUp(user);

    return {
      kind: ResultKind.LEVEL_UP,
      user: newUser,
      oldLevel,
      newLevel: newUser.level,
    };
  }

  return {
    kind: ResultKind.NO_CHANGE,
    user,
  };
}
