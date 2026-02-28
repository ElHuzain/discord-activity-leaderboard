import { ResultKind, XPDataType } from "../shared/enums";
import * as userModule from "./user";

export function increment(user: User): Result {
  user.message.count++;
  user.xp = userModule.addXp(user.xp, 1, XPDataType.MESSAGE);
  const oldLevel = user.level;

  if (userModule.canLevelUp(user)) {
    const newUser = userModule.levelUp(user);

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
