import { EmbedBuilder } from "discord.js";
import { client } from "./client";
import { ANNOUNCEMENT_CHANNEL_ID, GUILD_ID } from "../lib/env";

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
            { name: `\u200b`, value: `${RTL}\`${user.formattedTime}\``, inline: true },
            { name: `\u200b`, value: `${RTL}<@${user.id}>`, inline: true },
            { name: `\u200b`, value: `${RTL}**#${index + 1}**`, inline: true },
        );
    });

    await channel.send({ embeds: [embed] });
}
