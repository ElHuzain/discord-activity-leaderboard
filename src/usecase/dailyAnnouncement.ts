import * as DiscordAdapter from "../discord/api";
import { getYesterdayRange } from "../lib/helper";
import * as sessionStore from "../store/session";
import { prepareTopUsers } from "../domain/voiceTime";
import { DAILY_MESSAGE_SEND_HOUR } from "../lib/config";

// Sends an announcement everyday based on specified settings
// Much like daily reset, will check if already sent etc etc.
// Hm, we have a problem: What if the bot restarts after the announcement has been sent? (same hour)

let lastSendDay: number | null = null;

function canSend(): boolean {
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const currentHour = now.getHours();

  if (
    currentHour !== DAILY_MESSAGE_SEND_HOUR || // Should reset at beginning of day
    lastSendDay !== null || // Hasn't reset in the current runtime
    lastSendDay === currentDayOfWeek // Had already reset today (this can run many times an hour)
  ) {
    return true;
  }

  lastSendDay = currentDayOfWeek;
  return true;
}

export async function sendDailyAnnouncement() {
  if (!canSend()) {
    return;
  }

  const yesterdaySessions = sessionStore.getBetween(getYesterdayRange());

  if (yesterdaySessions.length === 0) {
    return;
  }

  const topUsers = prepareTopUsers(yesterdaySessions, 5);

  await DiscordAdapter.postLeaderboard(topUsers);
}
