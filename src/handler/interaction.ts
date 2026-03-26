import { Interaction } from "discord.js";
import handleTopWeek from "../usecase/handleTopWeek";

export async function handleInteraction(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "top-week") {
    await handleTopWeek(interaction);
  }
}
