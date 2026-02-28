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
3. Create `.env` with your environment variables:
    - `DISCORD_TOKEN` - Your Discord bot token
4. Update `config.json` with your configurations:
    - `roleLevelIds` - Array of role IDs corresponding to each level (First role is first level, second role is second level, etc.)
    - `ignored_channel_ids.text` - Array of text channels to ignore text activity (e.g, spam channels
    - `ignored_channel_ids.voice` - Array of voice channels to ignore voice activity (E.g, afk channels)
    - `guild_id` - The ID of your server
    - `anouncement_channel_ids.level_up` - The ID of the channel where level up messages will be sent
    - `announcement_channel_ids.leaderboard` - The ID of the channel where daily leaderboard messages will be sent
    - `daily_message_send_hour` - Hour of the day to send daily leaderboard announcement. Use 24 hour format
5. Start the bot with `npm run start`

Example `config.json`
```json
{
  "roleLevelIds": [
    "1477063790766985329",
    "1477063853354516490",
    "1477063892130599014",
    "1477063917074387087"
  ],
  "ignored_channel_ids": {
    "text": ["1476902140780875816", "1476903521269059725"],
    "voice": [
      "1472678368712458462",
      "1472678276630839306",
      "1315744963807412376"
    ]
  },
  "guild_id": "1001655098386170047",
  "announcement_channel_ids": {
    "level_up": "1416634243848605706",
    "leaderboard": "1477066562979631259"
  },
  "daily_message_send_hour": 13
}

```

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

### Storage

Every minute, the bot will attempt to store the current state of users in a JSON file `users.json`. (Only if the data has been updated!)

If JSON storage is not sufficient for your case and you'd like to use an actual database system, please update `/src/store.ts`.

## Future Considerations

This bot is currently under development, more features to come soon :)

Features currently in mind:
- Level multiplier configuration
- Leveling up enhancements (still deciding on whether users can have max level or not)
- Slash commands (`/top`, `/weekly`, etc)
- Weekly leaderboard announcements
- Localization - currently its kinda Arabic and kinda English

Feel free to contribute! :D
