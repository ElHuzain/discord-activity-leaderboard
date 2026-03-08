import * as userStore from "../store/user";
import * as voiceTime from "../domain/voiceTime";
import * as user from "../domain/user";

function handleMove(userId: string): void {
  const existing = userStore.getById(userId);

  if (!existing) {
    userStore.save(user.create(userId, { startSession: true }));

    return;
  }

  if (!voiceTime.hasActiveSession(existing)) {
    userStore.save(voiceTime.startSession(existing));
  }
}

export default handleMove;
