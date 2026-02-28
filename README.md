# Discord activity leaderboard

A Discord bot made with Discord.js. It tracks how long users spend in voice channels and messages they send, stores them. Then, everyday, it sends a leaderboard of top users based on their cumulative time & messages sent.

## Features

- Voice channel time tracking
- Message count trakcing
- XP leveling system with roles
- Daily leaderboard announcement

## Installation

1. Clone the repository `git clone git@github.com:ElHuzain/discord-voice-leaderboard.git`
2. Run `npm install`
3. Update `.env` with your configurations:
    - `DISCORD_TOKEN` - Your Discord bot token
    - `LOG_CHANNEL_ID` - ID of channel where logs will be sent
    - `ANNOUNCEMENT_CHANNEL_ID` - ID of channel where daily announcements will be sent
    - `GUILD_ID` - ID of your Discord server
    - `IGNORED_VOICE_CHANNEL_IDS`: Comma separated list of ids - IDs of voice channels to ignore (e.g, AFK channels).
    - `IGNORED_TEXT_CHANNEL_IDS`: Comma separated list of ids - IDs of text channels to ignore (e.g, AFK channels).
4. Start the bot with `npm run start`

## How It Works

The bot listens to `voiceStateUpdate` and `messageCreate` events.

### Voice Time Tracking

When a user joins a voice channel, a timestamp is stored in memory.  
When they leave, the duration is calculated and added to their cumulative total.

### Message Tracking

When a user sends a message, simply, increment message count and evaluate xp increase.

### XP Leveling System

Currently, the two main activities (voice channel and message sending) increase your XP, which levels you up when you reach milestones.

This feature is still under development.

To come:
- Multiplier configuration
- Leveling up enhancements (still deciding on whether users can have max level or not)

### Storage

Every minute, the bot will attempt to store the current state of users in a JSON file `users.json`. (Only if the data has been updated!)

If JSON storage is not sufficient for your case and you'd like to use an actual database system, please update `/src/store.ts`.
