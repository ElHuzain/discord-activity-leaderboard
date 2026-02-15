import Discord from "discord.js";
import { TOKEN } from "./src/lib/env.js";
import handleVoiceStateUpdate from "./src/leaderboardController.js";
import { init as InitializeDatabase } from "./src/repository/abstractStorage.js";

await InitializeDatabase();

const { Client, GatewayIntentBits, Events } = Discord;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.on(Events.ClientReady, () => console.log("Voice Leaderboard is up!"));

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.login(TOKEN);
