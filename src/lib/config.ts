import config from "../../config.json";

const GUILD_ID = config.guild_id;
const CLIENT_ID = config.client_id;
const ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID =
  config.announcement_channel_ids.leaderboard;
const IGNORED_VOICE_CHANNEL_IDS: string[] = config.ignored_channel_ids.voice;
const DAILY_MESSAGE_SEND_HOUR = config.daily_message_send_hour ?? 10;

const isValidConfig = (): boolean => {
  return (
    !!GUILD_ID &&
    typeof GUILD_ID === "string" &&
    !!CLIENT_ID &&
    typeof CLIENT_ID === "string" &&
    !!ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID &&
    typeof ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID === "string" &&
    Array.isArray(IGNORED_VOICE_CHANNEL_IDS) &&
    typeof DAILY_MESSAGE_SEND_HOUR === "number"
  );
};

export {
  GUILD_ID,
  CLIENT_ID,
  ANNOUNCEMENT_LEADERBOARD_CHANNEL_ID,
  IGNORED_VOICE_CHANNEL_IDS,
  DAILY_MESSAGE_SEND_HOUR,
  isValidConfig,
};
