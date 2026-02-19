import Discord from "discord.js";
import {
  ANNOUNCEMENT_CHANNEL_ID,
  DAILY_MESSAGE_SEND_HOUR,
  GUILD_ID,
  LOG_CHANNEL_ID,
  TOKEN,
} from "./src/lib/env.js";
import { init as InitializeDatabase } from "./src/repository/abstractStorage.js";
import UserRepository from "./src/repository/user.js";
import Announcement from "./src/service/announcement.js";
import UserService from "./src/service/user.js";

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

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const announcement = new Announcement(client, userRepository, userService);

await InitializeDatabase();
await announcement.init();

client.on(Events.ClientReady, async () => {
  await userService.syncUsers(client);
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => userService.handleVoiceStateUpdate(oldState, newState));

client.login(TOKEN);
