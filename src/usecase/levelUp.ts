import { getNthRoleId } from "../lib/config";
import { ResultKind } from "../shared/enums";
import * as DiscordAdapter from "../discord/api";

export async function levelUp(result: Result): Promise<void> {
  if (result.kind === ResultKind.LEVEL_UP) {
    const prevRole = getNthRoleId(result.oldLevel);
    const newRole = getNthRoleId(result.newLevel);

    if ((!prevRole && result.oldLevel !== 0) || !newRole) {
      console.error(`Failed to get role for user ${result.user.id}`);

      return;
    }

    await DiscordAdapter.userLevelUp(result.user.id, prevRole ?? null, newRole);

    await DiscordAdapter.postLevelUpMessage(result.user.id, result.newLevel);
  }
}
