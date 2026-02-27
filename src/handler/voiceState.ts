import type { VoiceState } from "discord.js";
import { GUILD_ID, IGNORED_VOICE_CHANNEL_IDS } from "../lib/env";
import * as userStore from "../store/user";
import * as voiceTime from "../domain/voiceTime";
import { getAllVoiceChannelUserIds } from "../discord/channel";

function isValidVoiceState(state: VoiceState): boolean {
    return !!state.channel
        && !IGNORED_VOICE_CHANNEL_IDS.includes(state.channelId!)
        && state.guild.id === GUILD_ID;
}

function handleJoin(userId: string): void {
    const existing = userStore.getById(userId);

    if (!existing) {
        userStore.save(voiceTime.createUser(userId));
        return;
    }

    if (existing.lastJoinedAt !== -1) {
        userStore.save(voiceTime.accumulateSession(existing));
        return;
    }

    userStore.save(voiceTime.stampJoin(existing));
}

function handleLeave(userId: string): void {
    const existing = userStore.getById(userId);
    if (!existing || existing.lastJoinedAt === -1) return;

    userStore.save(voiceTime.accumulateSession(existing));
}

function handleMove(userId: string): void {
    const existing = userStore.getById(userId);

    if (!existing) {
        userStore.save(voiceTime.createUser(userId));
        return;
    }

    if (existing.lastJoinedAt === -1) {
        userStore.save(voiceTime.stampJoin(existing));
    }
}

export function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): void {
    const wasInChannel = isValidVoiceState(oldState);
    const isInChannel = isValidVoiceState(newState);

    if (isInChannel && !wasInChannel) handleJoin(newState.member!.user.id);
    if (!isInChannel && wasInChannel) handleLeave(oldState.member!.user.id);
    if (isInChannel && wasInChannel) handleMove(newState.member!.user.id);
}

/**
 * Reconciles store state with live voice channels on startup.
 * Users tracked as active but no longer in a channel get their session accumulated.
 * Users in a channel but not tracked get a join timestamp.
 */
export async function syncUsers(): Promise<void> {
    const activeUsers = userStore.getActiveUsers();
    const voiceChannelUserIds = await getAllVoiceChannelUserIds();

    for (const userId of voiceChannelUserIds) {
        const isTracked = activeUsers.some(u => u.id === userId);
        if (isTracked) continue;

        const existing = userStore.getById(userId);
        if (existing) {
            userStore.save(voiceTime.stampJoin(existing));
        } else {
            userStore.save(voiceTime.createUser(userId));
        }
    }

    for (const user of activeUsers) {
        if (!voiceChannelUserIds.includes(user.id)) {
            userStore.save(voiceTime.accumulateSession(user));
        }
    }
}
