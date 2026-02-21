import { Client, EmbedBuilder } from "discord.js";
import { ANNOUNCEMENT_CHANNEL_ID, DAILY_MESSAGE_SEND_HOUR, GUILD_ID } from "../lib/env";
import UserRepository from "../repository/user";
import { getTimeFromMs } from "../lib/helper";
import { formatTime } from "../lib/helper";
import UserService from "./user";

class Announcement {
    lastSentDay: null | number = null;
    client: Client;
    UserRepository: UserRepository;
    UserService: UserService;

    constructor(client: Client, UserRepository: UserRepository, UserService: UserService) {
        this.client = client;
        this.UserRepository = UserRepository;
        this.UserService = UserService;
    }

    async postDailyAnnouncement() {
        try {
            const guild = await this.client.guilds.fetch(GUILD_ID!);

            const channel = await guild.channels.fetch(ANNOUNCEMENT_CHANNEL_ID!);

            if (!channel?.isTextBased()) {
                console.error(
                    "Unable to send daily announcement message: channel is not text-based!",
                );
                return;
            }

            await this.UserService.calculateAllUsersAndSetTimestamp();
            const users = await this.UserRepository.getTopUsers(5);

            const topUsers = await Promise.all(
                users.map(async (user) => {
                    const member = await guild.members.fetch(user.id);
                    const { hours, minutes, seconds } = getTimeFromMs(user.cumulative);
                    const formattedTime = formatTime(hours, minutes, seconds);
                    const profilePicture = member.user.displayAvatarURL({ size: 64, extension: "png" });

                    return {
                        id: user.id,
                        formattedTime,
                        profilePicture,
                    };
                }),
            );

            const RTL = "\u061C";

            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .addFields(
                    {
                        name: `${RTL}الوقت`,
                        value: ``,
                        inline: true
                    },
                    {
                        name: `${RTL}المستخدم`,
                        value: ``,
                        inline: true
                    },
                    {
                        name: `${RTL}المركز`,
                        value: ``,
                        inline: true
                    },
                );

            for (const user of topUsers) {
                const index = topUsers.indexOf(user);

                embed.addFields(
                    {
                        name: ``,
                        value: `${RTL}\`${user.formattedTime}\``,
                        inline: true
                    },
                    {
                        name: ``,
                        value: `${RTL}<@${user.id}>`,
                        inline: true
                    },
                    {
                        name: ``,
                        value: `${RTL}**#${index + 1}**`,
                        inline: true
                    },
                );
            }

            await channel.send({ embeds: [embed] });

            await this.UserService.resetAllUsers();
        } catch (error) {
            console.error("Error sending daily announcement message:", error);
        }
    }

    async init() {
        setInterval(async () => {
            const currentDay = new Date().getDate();
            const currentHour = new Date().getHours();

            if (this.lastSentDay === currentDay || currentHour !== DAILY_MESSAGE_SEND_HOUR) {
                return;
            }

            this.lastSentDay = currentDay;
            await this.postDailyAnnouncement();
        }, 60_000 * 30);
    }
}

export default Announcement;
