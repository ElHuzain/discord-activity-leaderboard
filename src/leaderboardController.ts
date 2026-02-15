import UserRepository from "./repository/user.js";
import UserModel from "./model/user.js";
import { GUILD_ID, IGNORED_VOICE_CHANNEL_IDS } from "./lib/env.js";

const handleVoiceStateUpdate = async (oldState, newState) => {
  if (
    IGNORED_VOICE_CHANNEL_IDS.includes(oldState.channelId) ||
    IGNORED_VOICE_CHANNEL_IDS.includes(newState.channelId) ||
    oldState.guildId !== GUILD_ID ||
    newState.guildId !== GUILD_ID
  ) {
    return;
  }

  const isOld = !!oldState.channel;
  const isNew = !!newState.channel;

  if (isNew && !isOld) {
    handleUserJoin(newState);
  }

  if (!isNew && isOld) {
    handleUserLeave(oldState);
  }

  if (isNew && isOld) {
    handleUserMove(newState);
  }
};

const handleUserJoin = async (state) => {
  const userId = state.member.user.id;
  const Repository = new UserRepository();

  const repoUser = await Repository.getById(userId);

  if (!repoUser) {
    const currentTimestamp = Date.now();
    const newUser = new UserModel({
      id: userId,
      lastJoinedAt: currentTimestamp,
    });

    Repository.save(newUser);

    return;
  }

  const user = new UserModel(repoUser);

  if (user.lastJoinedAt !== -1) {
    user.calculate();
    Repository.save(user);

    return;
  }

  const currentTimestamp = Date.now();

  user.lastJoinedAt = currentTimestamp;
  Repository.save(user);
};

const handleUserLeave = async (state) => {
  const userId = state.member.user.id;
  const Repository = new UserRepository();

  const repoUser = await Repository.getById(userId);

  if (!repoUser) {
    return;
  }

  const user = new UserModel(repoUser);

  if (user.lastJoinedAt === -1) {
    return;
  }

  user.calculate();
  Repository.save(user);
};

const handleUserMove = async (state) => {
  const userId = state.member.user.id;
  const Repository = new UserRepository();

  const repoUser = await Repository.getById(userId);

  if (!repoUser) {
    const currentTimestamp = Date.now();
    const newUser = new UserModel({
      id: userId,
      lastJoinedAt: currentTimestamp,
    });

    Repository.save(newUser);

    return;
  }

  const user = new UserModel(repoUser);

  if (user.lastJoinedAt === -1) {
    const currentTimestamp = Date.now();
    user.lastJoinedAt = currentTimestamp;

    Repository.save(user);

    return;
  }
};

export default handleVoiceStateUpdate;
