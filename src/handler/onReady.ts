import { sendDailyAnnouncement } from "../usecase/dailyAnnouncement";
import syncUsers from "../usecase/syncUsers";

export async function handleReady(): Promise<void> {
  await syncUsers();

  setInterval(async () => {
    await sendDailyAnnouncement();
  }, 30_000);
}

export default handleReady;
