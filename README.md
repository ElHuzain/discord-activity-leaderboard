# Discord voice leaderboard bot

A Discord bot made with Discord.js. It tracks how long users spend in voice channels and stores them. Then, everyday, it sends a leaderboard of top users based on their cumulative time.

## Installation

1. Clone the repository `git clone git@github.com:ElHuzain/discord-voice-leaderboard.git`
2. Run `npm install`
3. Update `.env` with your configurations:
  1. `DISCORD_TOKEN` - Your Discord bot token
  2. `LOG_CHANNEL_ID` - ID of channel where logs will be sent
  3. `ANNOUNCEMENT_CHANNEL_ID` - ID of channel where daily announcements will be sent
  4. `GUILD_ID` - ID of your Discord server
  5. `IGNORED_CHANNEL_IDS`: Comma separated list of ids - IDs of voice channels to ignore (e.g, AFK channels).
4. Start the bot with `npm run dev`

## How It Works

The bot listens to `voiceStateUpdate` events.  
When a user joins a voice channel, a timestamp is stored in memory.  
When they leave, the duration is calculated and added to their cumulative total.

Every minute, the bot will attempt to store the current state of users in a JSON file `users.json`. (Only if the data has been updated!)

If JSON storage is not sufficient for your case and you'd like to use an actual database system, please update `/src/repository.ts`.
