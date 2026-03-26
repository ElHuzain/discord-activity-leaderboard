type TimestampMs = number;

type User = {
  id: string;
  lastJoinedAt: TimestampMs | null;
};

type TopUser = {
  id: string;
  formattedTime: string;
  sessions: number;
};

type UserStore = Record<string, User>;

type Session = {
  userId: string;
  joinedAt: TimestampMs;
  leftAt: TimestampMs;
  isArchived?: boolean;
};

type Result =
  | { kind: "no_change"; user: User }
  | { kind: "level_up"; user: User; newLevel: number; oldLevel: number };
