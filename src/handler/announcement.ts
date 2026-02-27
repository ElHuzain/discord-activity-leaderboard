import * as userStore from "../store/user";
import * as voiceTime from "../domain/voiceTime";
import { postLeaderboard } from "../discord/embed";
import { getTimeFromMs, formatTime } from "../lib/helper";

export async function postDailyAnnouncement(): Promise<void> {
    try {
        const activeUsers = userStore.getActiveUsers();
        for (const user of activeUsers) {
            userStore.save(voiceTime.accumulateSession(user, true));
        }

        const topUsers = userStore.getTopUsers(5).map(user => {
            const { hours, minutes, seconds } = getTimeFromMs(user.cumulative);
            return { id: user.id, formattedTime: formatTime(hours, minutes, seconds) };
        });

        await postLeaderboard(topUsers);

        const usersWithCumulative = userStore.getUsersWithCumulative();
        for (const user of usersWithCumulative) {
            userStore.save(voiceTime.resetDaily(user));
        }
    } catch (error) {
        console.error("Error sending daily announcement:", error);
    }
}
