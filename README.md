# Discord activity leaderboard

A Discord bot made with Discord.js. It tracks how long users spend in voice channels and messages they send, stores them. Then, everyday, it sends a leaderboard of top users based on their cumulative time.

## Features

- Voice channel time tracking
- Message count trakcing
- XP leveling system with roles
- Daily leaderboard announcement

## Installation

1. Clone the repository `git clone git@github.com:ElHuzain/discord-voice-leaderboard.git`
2. Run `npm install`
3. Create `.env` and `config.json`
```bash
cp config.json.example config.json
cp .env.example .env
```
4. Update `.env` with your environment variables:
    - `DISCORD_TOKEN` - Your Discord bot token
5. Update `config.json` with your configurations:
    - `roleLevelIds` - Array of role IDs corresponding to each level (First role is first level, second role is second level, etc.)
    - `ignored_channel_ids.voice` - Array of voice channels to ignore voice activity (E.g, afk channels)
    - `guild_id` - The ID of your server
    - `anouncement_channel_ids.level_up` - The ID of the channel where level up messages will be sent
    - `announcement_channel_ids.leaderboard` - The ID of the channel where daily leaderboard messages will be sent
    - `daily_message_send_hour` - Hour of the day to send daily leaderboard announcement. Use 24 hour format
6. Start the bot with `npm run start`

## How It Works

The bot listens to `voiceStateUpdate` and `onReady` events.

When a user joins a voice channel, a timestamp is stored in memory.  
When they leave, the duration is calculated and added to their cumulative total.

As a fallback to outages, the onReady message will recover as follows:
- If a user is currently marked as "in a channel", but isn't in channel, they'll be immediately marked as session ended
- If a user is currently in a channel, but isn't marked as "in a channel", their session will start

### Storage

Every minute, the bot will attempt to store the current state of users in a JSON file `users.json` and `sessions.json`. (Only if the data has been updated!)

If JSON storage is not sufficient for your case and you'd like to use an actual database system, please update `/src/store.ts`.

## Future Considerations

This bot is currently under development, more features to come soon :)

Features currently in mind:
- Leveling system
- Slash commands (`/top`, `/weekly`, etc)
- Weekly / Daily leaderboard announcements
- Localization - currently its kinda Arabic and kinda English

Feel free to contribute! :D
