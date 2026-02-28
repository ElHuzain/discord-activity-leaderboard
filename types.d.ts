declare type User = {
  id: string;
  voice: {
    lastJoinedAt: number;
    cumulative: number;
    totalCumulative: number;
  };
  message: {
    count: number;
  };
  xp: number;
  level: number;
};

type Result =
  | { kind: "no_change"; user: User }
  | { kind: "level_up"; user: User; newLevel: number; oldLevel: number };
