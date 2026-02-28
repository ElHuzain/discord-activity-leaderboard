import {
  DMChannel,
  Message,
  NewsChannel,
  PartialDMChannel,
  PartialGroupDMChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  StageChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
  User as DiscordUser,
} from "discord.js";
import { GUILD_ID, IGNORED_TEXT_CHANNEL_IDS } from "../lib/config";
import * as userStore from "../store/user";
import * as user from "../domain/user";
import * as messageCount from "../domain/messageCount";
import * as DiscordAdapter from "../discord/api";
import { getNthRoleId } from "../lib/config";
import { ResultKind } from "../shared/enums";

function isValidChannel(
  channel:
    | TextChannel
    | DMChannel
    | PartialDMChannel
    | PartialGroupDMChannel
    | NewsChannel
    | StageChannel
    | PublicThreadChannel<boolean>
    | PrivateThreadChannel
    | VoiceChannel,
) {
  const isAcceptableChannelType =
    channel instanceof TextChannel || channel instanceof ThreadChannel;

  if (
    !isAcceptableChannelType ||
    IGNORED_TEXT_CHANNEL_IDS.includes(channel.id) ||
    !channel.guildId ||
    channel.guildId !== GUILD_ID
  ) {
    return false;
  }

  return true;
}

function isValidUser(user: DiscordUser) {
  if (!user || user.bot) {
    return false;
  }

  return true;
}

export async function handleMessageCreate(message: Message) {
  const { channel } = message;

  if (!isValidChannel(channel) || !isValidUser(message.author)) return;

  const existing = userStore.getById(message.author.id);

  if (!existing) {
    userStore.save(user.create(message.author.id, { count: 1 }));

    return;
  }

  const result = messageCount.increment(existing);

  userStore.save(result.user);

  if (result.kind === ResultKind.LEVEL_UP) {
    const prevRole = getNthRoleId(result.oldLevel);
    const newRole = getNthRoleId(result.newLevel);

    if ((!prevRole && result.oldLevel !== 0) || !newRole) {
      console.error(`Failed to get role for user ${message.author.id}`);

      return;
    }

    await DiscordAdapter.userLevelUp(
      message.author.id,
      prevRole ?? null,
      newRole,
    );
    await DiscordAdapter.postLevelUpMessage(message.author.id, result.newLevel);
  }
}
