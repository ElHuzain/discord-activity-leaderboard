import { getMaxLevel } from "../lib/config";
import { XPDataType } from "../shared/enums";

export function addXp(xp: number, value: number, data: XPDataType): number {
  switch (data) {
    case "voice":
      return xp + value / (1000 * 60);
    case "message":
      return xp + value;
    default:
      throw new Error(`Invalid data type: ${data}`);
  }
}

export function canLevelUp(user: User): boolean {
  // This will cause problems.
  // What if someone is maxed, but gains a ton of XP?
  // Will likely need a system that handles multiple level update
  // So when later, if the server adds more levels, the user can level up
  if (user.level >= getMaxLevel()) {
    console.log(`User: ${user.id} is already at max level`);

    return false;
  }

  const { xp } = user;

  if (xp >= (user.level + 1) * 5) {
    return true;
  }

  return false;
}

// Will need to udpate this later
// For the case when new level is more than one level
export function levelUp(user: User): User {
  return {
    ...user,
    xp: 0,
    level: user.level + 1,
  };
}
