type options = {
  stamp?: boolean;
  count?: number;
};

export function create(id: string, options?: options): User {
  return {
    id,
    voice: {
      lastJoinedAt: options?.stamp ? Date.now() : -1,
      cumulative: 0,
      totalCumulative: 0,
    },
    message: {
      count: options?.count ?? 0,
    },
    xp: 0,
    level: 0,
  };
}
