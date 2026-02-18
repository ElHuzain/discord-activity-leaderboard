import User, { UserDTO } from "../model/user";
import { users, setUpdated } from "./abstractStorage";

export default class UserRepository {
  constructor() {}

  async save(user: User | UserDTO): Promise<void> {
    const foundUser = users.find((u) => u.id === user.id);

    if (foundUser) {
      const newUserArray = users.map((u) => {
        if (u.id === foundUser.id) {
          return {
            ...user,
          };
        }

        return u;
      });

      users.splice(0, users.length, ...newUserArray);
    } else {
      users.push({
        id: user.id,
        lastJoinedAt: user.lastJoinedAt,
        cumulative: user.cumulative,
        totalCumulative: user.cumulative,
      });
    }

    setUpdated(true);
  }

  async getById(userId: string): Promise<User | null> {
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return null;
    } else {
      return new User(user);
    }
  }

  async getTopUsers(limit: number): Promise<User[]> {
    const topUsers = [...users]
      .filter((user) => user.cumulative > 0)
      .sort((a, b) => b.cumulative - a.cumulative)
      .slice(0, limit)
      .map((user) => new User(user));

    return topUsers;
  }

  async resetAllUsers(): Promise<void> {
    const newUserArray = users.map((user) => {
      const u = new User({
        id: user.id,
        lastJoinedAt: user.lastJoinedAt,
        cumulative: user.cumulative,
        totalCumulative: user.totalCumulative,
      });

      u.reset();

      return u;
    });

    users.splice(0, users.length, ...newUserArray);

    setUpdated(true);
  }
}
