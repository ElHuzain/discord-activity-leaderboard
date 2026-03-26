import * as userStore from "../store/user";
import * as sessionStore from "../store/session";
import * as voiceTime from "../domain/voiceTime";
import * as user from "../domain/user";

async function handleJoin(userId: string): Promise<void> {
  const existing = userStore.getById(userId);

  if (!existing) {
    userStore.save(user.create(userId, { startSession: true }));

    return;
  }

  if (voiceTime.hasActiveSession(existing)) {
    const { user, session } = voiceTime.endSession(existing);

    sessionStore.save(session);
    userStore.save(voiceTime.startSession(user));

    return;
  }

  userStore.save(voiceTime.startSession(existing));
}

export default handleJoin;
