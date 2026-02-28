import config from "../../config.json";

function getMaxLevel(): number {
  return config.roleLevelIds.length;
}

function getNthRoleId(level: number): string | undefined {
  return config.roleLevelIds[level - 1];
}

const GUILD_ID = config.guild_id;
const ANNOUNCEMENT_LEVEL_UP_CHANNEL_ID =
  config.announcement_channel_ids.level_up;
const ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID =
  config.announcement_channel_ids.leaderboard;
const IGNORED_TEXT_CHANNEL_IDS: string[] = config.ignored_channel_ids.text;
const IGNORED_VOICE_CHANNEL_IDS: string[] = config.ignored_channel_ids.voice;
const DAILY_MESSAGE_SEND_HOUR = config.daily_message_send_hour ?? 10;

const isValidConfig = (): boolean => {
  return (
    !!GUILD_ID &&
    typeof GUILD_ID === "string" &&
    !!ANNOUNCEMENT_LEVEL_UP_CHANNEL_ID &&
    typeof ANNOUNCEMENT_LEVEL_UP_CHANNEL_ID === "string" &&
    !!ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID &&
    typeof ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID === "string" &&
    Array.isArray(IGNORED_TEXT_CHANNEL_IDS) &&
    Array.isArray(IGNORED_VOICE_CHANNEL_IDS) &&
    typeof DAILY_MESSAGE_SEND_HOUR === "number"
  );
};

export {
  getMaxLevel,
  getNthRoleId,
  GUILD_ID,
  ANNOUNCEMENT_LEVEL_UP_CHANNEL_ID,
  ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID,
  IGNORED_TEXT_CHANNEL_IDS,
  IGNORED_VOICE_CHANNEL_IDS,
  DAILY_MESSAGE_SEND_HOUR,
  isValidConfig,
};
