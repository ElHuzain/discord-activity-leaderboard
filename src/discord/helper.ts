import {
  BaseChannel,
  Guild,
  GuildMember,
  NewsChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { client } from "./client";
import { ANNOUNCEMENT_CHANNEL_ID, GUILD_ID } from "../lib/env";

export async function getGuild(): Promise<Guild> {
  try {
    const guild =
      client.guilds.cache.get(GUILD_ID) ??
      (await client.guilds.fetch(GUILD_ID));

    return guild;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Could not fetch guild: ${errMsg}`);
  }
}

export async function getMember(userId: string): Promise<GuildMember | null> {
  const guild = await getGuild();

  try {
    const member =
      guild.members.cache.get(userId) ?? (await guild.members.fetch(userId));

    return member;
  } catch (err) {
    console.error("Could not fetch member:", err);

    return null;
  }
}

export async function getAnnouncementChannel(): Promise<TextChannel | null> {
  const guild = await getGuild();

  try {
    const channel =
      guild.channels.cache.get(ANNOUNCEMENT_CHANNEL_ID!) ??
      (await guild.channels.fetch(ANNOUNCEMENT_CHANNEL_ID!));

    if (!(channel instanceof TextChannel)) {
      throw new Error("Channel is not a text channel");
    }

    return channel;
  } catch (err) {
    console.error("Could not fetch announcement channel:", err);

    return null;
  }
}
