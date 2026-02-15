export type UserDTO = {
  id: string;
  lastJoinedAt: number;
  cumulative: number;
};

export default class User {
  readonly id: string;
  lastJoinedAt: number;
  cumulative: number;

  constructor({ id, lastJoinedAt = -1, cumulative = 0 }) {
    this.id = id;
    this.lastJoinedAt = lastJoinedAt;
    this.cumulative = cumulative;
  }

  calculate(): void {
    const currentTimestamp = Date.now();
    const difference = currentTimestamp - this.lastJoinedAt;

    this.cumulative = difference;
    this.lastJoinedAt = -1;
  }
}
