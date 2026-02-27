import { ChannelType, type BaseGuildVoiceChannel } from "discord.js";
import { client } from "./client";
import { GUILD_ID, IGNORED_VOICE_CHANNEL_IDS } from "../lib/env";

export async function getAllVoiceChannelUserIds(): Promise<string[]> {
    const guild = await client.guilds.fetch(GUILD_ID!);
    const allChannels = await guild.channels.fetch();
    const voiceChannels = allChannels.filter(ch => ch?.type === ChannelType.GuildVoice);

    const userIds: string[] = [];

    for (const [, channel] of voiceChannels) {
        const voiceChannel = channel as BaseGuildVoiceChannel;
        for (const [, member] of voiceChannel.members) {
            if (IGNORED_VOICE_CHANNEL_IDS.includes(voiceChannel.id) || member.user.bot) continue;
            userIds.push(member.user.id);
        }
    }

    return userIds;
}
