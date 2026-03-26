import { Guild, GuildMember, TextChannel } from "discord.js";
import { client } from "./client";
import { GUILD_ID } from "../lib/config";

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
