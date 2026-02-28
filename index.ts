import Discord from "discord.js";
import { DAILY_MESSAGE_SEND_HOUR, isValidConfig } from "./src/lib/config.js";
import { init as initStore } from "./src/store/persistence.js";
import { client } from "./src/discord/client.js";
import { handleVoiceStateUpdate, syncUsers } from "./src/handler/voiceState.js";
import { postDailyAnnouncement } from "./src/handler/announcement.js";
import { handleMessageCreate } from "./src/handler/messageCreate.js";
import { TOKEN } from "./src/lib/env.js";

if (!isValidConfig())
  throw Error(
    "\n---\nInvalid configurations.\nPlease refer to `README.md` for instructions.\n---\n",
  );

const { Events } = Discord;

initStore();

let lastSentDay: number | null = null;

setInterval(async () => {
  const now = new Date();
  if (
    lastSentDay === now.getDate() ||
    now.getHours() !== DAILY_MESSAGE_SEND_HOUR
  )
    return;

  lastSentDay = now.getDate();
  await postDailyAnnouncement();
}, 60_000 * 30);

client.on(Events.ClientReady, async () => {
  await syncUsers();
});

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.on(Events.MessageCreate, handleMessageCreate);

client.login(TOKEN);
