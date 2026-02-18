export type UserDTO = {
  id: string;
  lastJoinedAt: number;
  cumulative: number;
  totalCumulative: number;
};

export default class User {
  readonly id: string;
  lastJoinedAt: number;
  cumulative: number;
  totalCumulative: number;

  constructor({ id, lastJoinedAt = -1, cumulative = 0, totalCumulative = 0 }) {
    this.id = id;
    this.lastJoinedAt = lastJoinedAt;
    this.cumulative = cumulative;
    this.totalCumulative = totalCumulative;
  }

  calculate(): void {
    const currentTimestamp = Date.now();
    const difference = currentTimestamp - this.lastJoinedAt;

    this.cumulative = difference;
    this.lastJoinedAt = -1;
  }

  reset(): void {
    this.totalCumulative += this.cumulative;
    this.cumulative = 0;
  }
}
