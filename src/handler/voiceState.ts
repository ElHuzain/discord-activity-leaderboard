import { type VoiceState } from "discord.js";
import { GUILD_ID, IGNORED_VOICE_CHANNEL_IDS } from "../lib/config";
import handleJoin from "../usecase/handleJoin";
import handleLeave from "../usecase/handleLeave";
import handleMove from "../usecase/handleMove";

function isValidVoiceState(state: VoiceState): boolean {
  return (
    !!state.channel &&
    !IGNORED_VOICE_CHANNEL_IDS.includes(state.channelId!) &&
    state.guild.id === GUILD_ID &&
    !!state.member &&
    !state.member.user.bot
  );
}

export async function handleVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  const wasInChannel = isValidVoiceState(oldState);
  const isInChannel = isValidVoiceState(newState);

  if (isInChannel && !wasInChannel) handleJoin(newState.member!.user.id);
  if (!isInChannel && wasInChannel) handleLeave(oldState.member!.user.id);
  if (isInChannel && wasInChannel) handleMove(newState.member!.user.id);
}
