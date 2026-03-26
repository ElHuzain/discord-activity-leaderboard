import { TOKEN } from './src/lib/env';
import { GUILD_ID, CLIENT_ID } from './src/lib/config';
import { SlashCommandBuilder, REST, Routes } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('top-week')
    .setDescription('Get top voice channel sessions for this week');

const commands = [data];

const rest = new REST().setToken(TOKEN!);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const response: any = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        console.log(`Successfully reloaded ${response.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();