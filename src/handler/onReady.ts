import { sendDailyAnnouncement } from "../usecase/dailyAnnouncement";
import syncUsers from "../usecase/syncUsers";
import archiveSessions from "../usecase/archiveSessions";

export async function handleReady(): Promise<void> {
  await syncUsers();

  setInterval(async () => {
    await sendDailyAnnouncement();
  }, 30_000);

  setInterval(async () => {
    await archiveSessions();
  }, 4 * 60 * 60 * 1000);
}

export default handleReady;
