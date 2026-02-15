import fs from "fs";
import { UserDTO } from "../model/user";

let users: UserDTO[] = [];

const RELATIVE_FILE_PATH = "src/repository/users.json";

const persistData = (data: UserDTO[]) => {
  fs.writeFile(RELATIVE_FILE_PATH, JSON.stringify(data), (err) => {});
};

const loadData = (): void => {
  fs.readFile(RELATIVE_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    }

    const parsed = JSON.parse(data) as UserDTO[];
    users = parsed;
  });
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
    persistData(users);
  }, 500);
};

export { persistData, loadData, init, users };
