import Discord from "discord.js";
import {
  ANNOUNCEMENT_CHANNEL_ID,
  DAILY_MESSAGE_SEND_HOUR,
  GUILD_ID,
  LOG_CHANNEL_ID,
  TOKEN,
} from "./src/lib/env.js";
import { init as initStore } from "./src/store/persistence.js";
import { client } from "./src/discord/client.js";
import { handleVoiceStateUpdate, syncUsers } from "./src/handler/voiceState.js";
import { postDailyAnnouncement } from "./src/handler/announcement.js";

if (
  ANNOUNCEMENT_CHANNEL_ID === "" ||
  TOKEN === "" ||
  LOG_CHANNEL_ID === "" ||
  GUILD_ID === "" ||
  DAILY_MESSAGE_SEND_HOUR === undefined
) {
  throw new Error(
    "Environment variables are not set!\nPlease refer to README.md for instructions",
  );
}

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

client.login(TOKEN);
