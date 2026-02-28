import dotenv from "dotenv";

dotenv.config();

export const TOKEN = process.env.DISCORD_TOKEN;
export const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
export const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID;
export const IGNORED_VOICE_CHANNEL_IDS =
  (process.env.IGNORED_VOICE_CHANNEL_IDS &&
    process.env.IGNORED_VOICE_CHANNEL_IDS.split(",")) ||
  [];
export const IGNORED_TEXT_CHANNEL_IDS =
  (process.env.IGNORED_TEXT_CHANNEL_IDS &&
    process.env.IGNORED_TEXT_CHANNEL_IDS.split(",")) ||
  [];
export const GUILD_ID = process.env.GUILD_ID;
export const DAILY_MESSAGE_SEND_HOUR = parseInt(
  process.env.DAILY_MESSAGE_SEND_HOUR || "11",
);
