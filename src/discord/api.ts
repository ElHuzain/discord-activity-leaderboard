import {
  APIApplicationCommandPermissionsConstant,
  ChannelType,
  EmbedBuilder,
  type BaseGuildVoiceChannel,
  type NonThreadGuildBasedChannel,
} from "discord.js";
import { client } from "./client";
import {
  ANNOUNCEMENT_CHANNEL_ID,
  GUILD_ID,
  IGNORED_VOICE_CHANNEL_IDS,
} from "../lib/env";
import * as DiscordHelper from "./helper";

export async function getAllVoiceChannelUserIds(): Promise<string[]> {
  const guild = await client.guilds.fetch(GUILD_ID!);
  const allChannels = await guild.channels.fetch();
  const voiceChannels = allChannels.filter(
    (ch: NonThreadGuildBasedChannel | null) =>
      ch !== null && ch.type === ChannelType.GuildVoice,
  );

  const userIds: string[] = [];

  for (const [, channel] of voiceChannels) {
    const voiceChannel = channel as BaseGuildVoiceChannel;
    for (const [, member] of voiceChannel.members) {
      if (
        IGNORED_VOICE_CHANNEL_IDS.includes(voiceChannel.id) ||
        member.user.bot
      )
        continue;
      userIds.push(member.user.id);
    }
  }

  return userIds;
}

type TopUser = { id: string; formattedTime: string };

export async function postLeaderboard(topUsers: TopUser[]): Promise<void> {
  const guild = await client.guilds.fetch(GUILD_ID!);
  if (!guild) throw new Error("Guild not found");

  const channel = await guild.channels.fetch(ANNOUNCEMENT_CHANNEL_ID!);
  if (!channel || !channel.isTextBased()) {
    throw new Error("Announcement channel is not a text channel");
  }

  const RTL = "\u061C";

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .addFields(
      { name: `${RTL}الوقت`, value: `\u200b`, inline: true },
      { name: `${RTL}المستخدم`, value: `\u200b`, inline: true },
      { name: `${RTL}المركز`, value: `\u200b`, inline: true },
    );

  topUsers.forEach((user, index) => {
    embed.addFields(
      {
        name: `\u200b`,
        value: `${RTL}\`${user.formattedTime}\``,
        inline: true,
      },
      { name: `\u200b`, value: `${RTL}<@${user.id}>`, inline: true },
      { name: `\u200b`, value: `${RTL}**#${index + 1}**`, inline: true },
    );
  });

  await channel.send({ embeds: [embed] });
}

/**
 * Updates user roles based on level changes
 */
export async function userLevelUp(
  userId: string,
  oldLevelRoleId: string | null,
  newLevelRoleId: string,
): Promise<void> {
  const member = await DiscordHelper.getMember(userId);

  if (!member) {
    return;
  }

  try {
    if (
      oldLevelRoleId &&
      oldLevelRoleId !== newLevelRoleId &&
      member.roles.cache.has(oldLevelRoleId)
    ) {
      await member.roles.remove(oldLevelRoleId);
    }

    await member.roles.add(newLevelRoleId);
  } catch (error) {
    console.error("Could not update user roles:", error);
  }
}

export async function postLevelUpMessage(userId: string, newLevel: number) {
  const member = await DiscordHelper.getMember(userId);
  const channel = await DiscordHelper.getAnnouncementChannel();

  if (!member || !channel) {
    return;
  }

  try {
    await member.send(
      `Congratulations, <@${member.id}>! You've reached level ${newLevel}!`,
    );
  } catch (error) {
    console.error("Could not send level up message:", error);
  }
}
