import * as DiscordAdapter from "../discord/api";
import { getYesterdayRange, getTimeFromMs, formatTime } from "../lib/helper";
import * as sessionStore from "../store/session";

// Sends an announcement everyday based on specified settings
// Much like daily reset, will check if already sent etc etc.
// Hm, we have a problem: What if the bot restarts after the announcement has been sent? (same hour)

let lastSendDay: number | null = null;

function canSend(): boolean {
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const currentHour = now.getHours();

  if (
    currentHour !== 0 || // Should reset at beginning of day
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

  const userTimes: Record<string, number> = {};
  for (const session of yesterdaySessions) {
    userTimes[session.userId] = (userTimes[session.userId] || 0) + (session.leftAt - session.joinedAt);
  }

  const sortedUsers = Object.entries(userTimes).sort((a, b) => b[1] - a[1]);

  const topUsers: TopUser[] = sortedUsers.map(([id, timeMs]) => {
    const { hours, minutes, seconds } = getTimeFromMs(timeMs);
    return {
      id,
      formattedTime: formatTime(hours, minutes, seconds),
    };
  });

  await DiscordAdapter.postLeaderboard(topUsers);
}
