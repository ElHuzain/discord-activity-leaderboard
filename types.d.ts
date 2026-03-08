type TimestampMs = number;

type User = {
  id: string;
  lastJoinedAt: TimestampMs | null;
};

type UserStore = Record<string, User>;

type Session = {
  userId: string;
  joinedAt: TimestampMs;
  leftAt: TimestampMs;
};

type Result =
  | { kind: "no_change"; user: User }
  | { kind: "level_up"; user: User; newLevel: number; oldLevel: number };
