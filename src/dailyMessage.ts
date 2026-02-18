import { Client, EmbedBuilder } from "discord.js";
import {
  ANNOUNCEMENT_CHANNEL_ID,
  GUILD_ID,
  DAILY_MESSAGE_SEND_HOUR,
} from "./lib/env";
import UserRepository from "./repository/user";
import { formatTime, getTimeFromMs } from "./lib/helper";

let lastSentDay: null | number = null;

const postDailyAnnouncement = async (client: Client) => {
  try {

    const guild = await client.guilds.fetch(GUILD_ID!);

    const channel = await guild.channels.fetch(ANNOUNCEMENT_CHANNEL_ID!);

    if (!channel?.isTextBased()) {
      console.error(
        "Unable to send daily announcement message: channel is not text-based!",
      );
      return;
    }

    const repository = new UserRepository();

    const users = await repository.getTopUsers(3);

    const topUsers = await Promise.all(
      users.map(async (user) => {
        const member = await guild.members.fetch(user.id);
        const displayName = member.user.globalName;
        const { hours, minutes, seconds } = getTimeFromMs(user.cumulative);

        return {
          displayName,
          hours,
          minutes,
          seconds,
        };
      }),
    );

    const description = topUsers
      .map(user => {
        const formattedTime = formatTime(user.hours, user.minutes, user.seconds);

        return `**${user.displayName}** — \`${formattedTime}\``;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`Voice Activity Leaderboard - ${new Date().toLocaleDateString()}`)
      .setDescription(`${description || "No data available."}`)
      .setColor(0x000000);

    await channel.send({ embeds: [embed] });

    await repository.resetAllUsers();
  } catch (error) {
    console.error("Error sending daily announcement message:", error);
  }
};

const init = async (client: Client) => {
  setInterval(async () => {
    const currentDay = new Date().getDate();
    const currentHour = new Date().getHours();

    if (lastSentDay === currentDay || currentHour !== DAILY_MESSAGE_SEND_HOUR) {
      return;
    }

    lastSentDay = currentDay;
    await postDailyAnnouncement(client);
  }, 60_000 * 30);
};

export { init };
