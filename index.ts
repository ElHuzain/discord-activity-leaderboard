import Discord, { BaseGuildVoiceChannel, ChannelType, GuildMember } from "discord.js";
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
import UserRepository from "./src/repository/user.js";
import UserModel from "./src/model/user.js";
import { IGNORED_VOICE_CHANNEL_IDS } from "./src/lib/env.js";

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

client.on(Events.ClientReady, async () => {
  const repository = new UserRepository();
  const registeredUsers = await repository.getAllUsers({ hasJoinedTimestamp: true });

  const guild = await client.guilds.fetch(GUILD_ID);

  const allChannels = await guild.channels.fetch();
  const allVoiceChannels = allChannels.filter(channel => channel?.type === ChannelType.GuildVoice);
  let userIdsInChannels: string[] = [];

  allVoiceChannels.forEach(async (channel: BaseGuildVoiceChannel) => {
    channel.members.forEach(async (member: GuildMember) => {
      if(IGNORED_VOICE_CHANNEL_IDS.includes(channel.id)) return;

      const isRegistered = registeredUsers.some(user => user.id === member.id);
      if (!isRegistered) {
        const user = new UserModel({
          id: member.id,
          lastJoinedAt: Date.now(),
        });
        repository.save(user);
      } else { 
        userIdsInChannels.push(member.user.id);
      }
    });
  });

  registeredUsers.forEach(user => {
    const notInChannels = !userIdsInChannels.includes(user.id);

    if(notInChannels) {
      user.calculate();

      repository.save(user);
    }
  });
});

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.login(TOKEN);
