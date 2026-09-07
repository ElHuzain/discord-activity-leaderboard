import {
  ChannelType,
  EmbedBuilder,
  type BaseGuildVoiceChannel,
  type NonThreadGuildBasedChannel,
  ChatInputCommandInteraction,
  MessageFlags
} from "discord.js";
import { client } from "./client";
import {
  ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID,
  GUILD_ID,
  IGNORED_VOICE_CHANNEL_IDS,
  LANGUAGE,
} from "../lib/config";
import { t } from "../lib/helper";

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

type LeaderboardDestination = {
  guildId: string;
  channelId: string;
};

export async function postLeaderboard(
  topUsers: TopUser[],
  destination: LeaderboardDestination = {
    guildId: GUILD_ID!,
    channelId: ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID!,
  },
): Promise<void> {
  const guild = await client.guilds.fetch(destination.guildId);
  if (!guild) throw new Error("Guild not found");

  const channel = await guild.channels.fetch(destination.channelId);
  if (!channel || !channel.isTextBased()) {
    throw new Error("Announcement channel is not a text channel");
  }

  const guildIcon = guild.iconURL();
  const rankBadges = ["🥇", "🥈", "🥉"];
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle(`🏆 ${t("TOP_DAILY_TITLE", {})}`)
    .setThumbnail(guildIcon)
    .setFooter({
      text: t("FOOTER_TEST"),
      ...(guildIcon ? { iconURL: guildIcon } : {}),
    })
    .setTimestamp();

  if (topUsers.length === 0) {
    embed.setDescription(`━━━━━━━━━━━━━━━━━━━━\n\n📭 ${t("NO_USERS_FOUND")}`);
  } else {
    const fieldDirection = LANGUAGE === "ar" ? "\u200f" : "";

    topUsers.forEach((user, index) => {
      const badge = rankBadges[index] ?? "🏅";
      const precedingGap = index > 0 ? "\u200b\n" : "";
      const formattedTime = `\`${user.formattedTime}\``;

      embed.addFields({
        name: `${precedingGap}${badge} ${t("RANK_HEADER", { rank: index + 1 })}`,
        value: `\u200b\n${fieldDirection}👤 <@${user.id}> \n${fieldDirection}⏱️ ${t("TIME_LINE", { time: formattedTime })}\n${fieldDirection}🎙️ ${t("SESSIONS_LINE", { sessions: user.sessions })}`,
        inline: false,
      });
    });
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.log("Error trying to send daily message:", err);
  }
}

export async function sendTopWeekly(interaction: ChatInputCommandInteraction, topUsers: TopUser[]): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(t("TOP_WEEKLY_TITLE", {}))

  if (topUsers.length === 0) {
    embed.setDescription(t("NO_USERS_FOUND", {}));
  } else {
    topUsers.forEach((user, index) => {
      embed.addFields({
        name: t("RANK_HEADER", { rank: index + 1 }),
        value: `${t("USER_LINE", { userId: user.id })}\n${t("TIME_LINE", { time: user.formattedTime })}\n${t("SESSIONS_LINE", { sessions: user.sessions })}`,
        inline: false,
      });
    });
  }

  await interaction.reply({
    embeds: [embed], flags: MessageFlags.Ephemeral
  });
}
