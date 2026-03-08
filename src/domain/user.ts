type options = {
  startSession?: boolean;
};

export function create(id: string, options?: options): User {
  return {
    id,
    lastJoinedAt: options?.startSession ? Date.now() : null,
  };
}
