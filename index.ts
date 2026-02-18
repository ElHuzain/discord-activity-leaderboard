import Discord from "discord.js";
import {
  ANNOUNCEMENT_CHANNEL_ID,
  DAILY_MESSAGE_SEND_HOUR,
  GUILD_ID,
  LOG_CHANNEL_ID,
  TOKEN,
} from "./src/lib/env.js";
import handleVoiceStateUpdate from "./src/leaderboardController.js";
import { init as InitializeDatabase } from "./src/repository/abstractStorage.js";
import { init as InitDailyMessage } from "./src/dailyMessage.js";

if (
  ANNOUNCEMENT_CHANNEL_ID === "" ||
  TOKEN === "" ||
  LOG_CHANNEL_ID === "" ||
  GUILD_ID === "" ||
  DAILY_MESSAGE_SEND_HOUR === undefined
) {
  const err = `Environment variables are not set!\nPlease refer to README.md for instructions`;
  throw new Error(err);
}

const { Client, GatewayIntentBits, Events } = Discord;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

await InitializeDatabase();
await InitDailyMessage(client);

client.on(Events.ClientReady, () => console.log("Voice Leaderboard is up!"));

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.login(TOKEN);
