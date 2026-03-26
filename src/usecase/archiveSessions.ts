import * as sessionStore from "../store/session";

export default async function archiveSessions(): Promise<void> {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  await sessionStore.archiveOlderThan(oneWeekAgo);
}
