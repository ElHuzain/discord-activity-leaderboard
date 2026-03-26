import { ChatInputCommandInteraction } from "discord.js";
import { getWeekRange } from "../lib/helper";
import * as sessionStore from "../store/session";
import { prepareTopUsers } from "../domain/voiceTime";
import { sendTopWeekly } from "../discord/api";

export default async function handleTopWeek(interaction: ChatInputCommandInteraction): Promise<void> {
  const range = getWeekRange(Date.now());
  const sessions = sessionStore.getBetween(range);

  const topUsers = prepareTopUsers(sessions);

  await sendTopWeekly(interaction, topUsers);
}
