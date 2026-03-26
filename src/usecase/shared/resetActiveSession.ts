import * as voiceTime from "../../domain/voiceTime";
import * as userStore from "../../store/user";
import * as sessionStore from "../../store/session";

/**
 * Takes user with active session, ends it, and starts a new one
 */
export function resetActiveSession(user: User) {
  const { user: updatedUser, session } = voiceTime.endSession(user);

  userStore.save(updatedUser);
  sessionStore.save(session);
}
