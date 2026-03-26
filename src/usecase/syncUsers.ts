import * as userStore from "../store/user";
import * as sessionStore from "../store/session";
import * as voiceTime from "../domain/voiceTime";
import * as user from "../domain/user";
import { getAllVoiceChannelUserIds } from "../discord/api";

/**
 * Reconciles store state with live voice channels on startup.
 * Users tracked as active but no longer in a channel get their session accumulated.
 * Users in a channel but not tracked get a join timestamp.
 */
export async function syncUsers(): Promise<void> {
  const activeUsers = userStore.getActiveUsers();
  const voiceChannelUserIds = await getAllVoiceChannelUserIds();

  for (const userId of voiceChannelUserIds) {
    const isTracked = activeUsers.some((u) => u.id === userId);
    if (isTracked) continue;

    const existing = userStore.getById(userId);

    if (existing) {
      userStore.save(voiceTime.startSession(existing));
    } else {
      userStore.save(user.create(userId, { startSession: true }));
    }
  }

  for (const user of activeUsers) {
    if (!voiceChannelUserIds.includes(user.id)) {
      const { user: updatedUser, session } = voiceTime.endSession(user);
      userStore.save(updatedUser);
      sessionStore.save(session);
    }
  }
}

export default syncUsers;
