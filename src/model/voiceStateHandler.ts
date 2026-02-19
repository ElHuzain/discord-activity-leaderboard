import { GUILD_ID } from "../lib/env";
import UserRepository from "../repository/user";
import UserModel from "./user";
import { IGNORED_VOICE_CHANNEL_IDS } from "../lib/env";
import { BaseGuildVoiceChannel, ChannelType, Client, GuildMember } from "discord.js";

class VoiceStateHandler {
  constructor() { }

  async syncUsers(client: Client) {
    const repository = new UserRepository();
    const registeredUsers = await repository.getAllUsers({ hasJoinedTimestamp: true });

    const guild = await client.guilds.fetch(GUILD_ID!);

    const allChannels = await guild.channels.fetch();
    const allVoiceChannels = allChannels.filter(channel => channel?.type === ChannelType.GuildVoice);
    let userIdsInChannels: string[] = [];

    allVoiceChannels.forEach(async (channel: BaseGuildVoiceChannel) => {
      channel.members.forEach(async (member: GuildMember) => {
        if (IGNORED_VOICE_CHANNEL_IDS.includes(channel.id) || member.user.bot) return;

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

      if (notInChannels) {
        user.calculate();

        repository.save(user);
      }
    });
  }

  async handleVoiceStateUpdate(oldState, newState) {
    const isOld =
      !!oldState.channel &&
      !IGNORED_VOICE_CHANNEL_IDS.includes(oldState.channelId) &&
      oldState.guild.id === GUILD_ID;
    const isNew =
      !!newState.channel &&
      !IGNORED_VOICE_CHANNEL_IDS.includes(newState.channelId) &&
      newState.guild.id === GUILD_ID;

    if (isNew && !isOld) {
      this.handleUserJoin(newState);
    }

    if (!isNew && isOld) {
      this.handleUserLeave(oldState);
    }

    if (isNew && isOld) {
      this.handleUserMove(newState);
    }
  }

  async handleUserJoin(state) {
    const userId = state.member.user.id;
    const Repository = new UserRepository();

    const repoUser = await Repository.getById(userId);

    if (!repoUser) {
      const currentTimestamp = Date.now();
      const newUser = new UserModel({
        id: userId,
        lastJoinedAt: currentTimestamp,
      });

      Repository.save(newUser);

      return;
    }

    const user = new UserModel(repoUser);

    if (user.lastJoinedAt !== -1) {
      user.calculate();
      Repository.save(user);

      return;
    }

    const currentTimestamp = Date.now();

    user.lastJoinedAt = currentTimestamp;
    Repository.save(user);
  }

  async handleUserLeave(state) {
    const userId = state.member.user.id;
    const Repository = new UserRepository();

    const repoUser = await Repository.getById(userId);

    if (!repoUser) {
      return;
    }

    const user = new UserModel(repoUser);

    if (user.lastJoinedAt === -1) {
      return;
    }

    user.calculate();
    Repository.save(user);
  }

  async handleUserMove(state) {
    const userId = state.member.user.id;
    const Repository = new UserRepository();

    const repoUser = await Repository.getById(userId);

    if (!repoUser) {
      const currentTimestamp = Date.now();
      const newUser = new UserModel({
        id: userId,
        lastJoinedAt: currentTimestamp,
      });

      Repository.save(newUser);

      return;
    }

    const user = new UserModel(repoUser);

    if (user.lastJoinedAt === -1) {
      const currentTimestamp = Date.now();
      user.lastJoinedAt = currentTimestamp;

      Repository.save(user);

      return;
    }
  }
}

export default VoiceStateHandler;
