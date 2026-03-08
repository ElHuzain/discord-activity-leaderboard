import * as userStore from "../store/user";
import * as sessionStore from "../store/session";
import * as voiceTime from "../domain/voiceTime";

async function handleLeave(userId: string): Promise<void> {
  const existing = userStore.getById(userId);
  if (!existing || !voiceTime.hasActiveSession(existing)) return;

  const { user, session } = voiceTime.endSession(existing);

  userStore.save(user);
  sessionStore.save(session);
}

export default handleLeave;
