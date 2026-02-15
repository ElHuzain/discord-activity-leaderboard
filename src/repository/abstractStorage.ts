import fs from "fs";
import { UserDTO } from "../model/user";

let users: UserDTO[] = [];
let isUpdated = false;

const RELATIVE_FILE_PATH = "src/repository/users.json";

const persistData = (data: UserDTO[]) => {
  fs.writeFile(RELATIVE_FILE_PATH, JSON.stringify(data), (err) => {});

  setUpdated(false);
};

const loadDataSync = async () => {
  try {
    const data = fs.readFileSync(RELATIVE_FILE_PATH, "utf8");
    const parsed = JSON.parse(data) as UserDTO[];
    users = parsed;
  } catch (err) {
    console.error(err);
  }
};

const init = async () => {
  await loadDataSync();

  setInterval(() => {
    if (isUpdated) {
      persistData(users);
    }
  }, 30_000);
};

const setUpdated = (value: boolean) => {
  isUpdated = value;
};

export { init, users, setUpdated };
