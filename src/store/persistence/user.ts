import fs from "fs";

const FILE_PATH = "src/store/users.json";

let data: UserStore = {};
let isDirty = false;

export function init(): void {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    data = JSON.parse(raw) as UserStore;
  } catch {
    data = {};
  }
}

function shouldPersist() {
  return isDirty;
}

export function persist() {
  if (!shouldPersist()) return;
  fs.writeFile(FILE_PATH, JSON.stringify(data), () => {});
  isDirty = false;
}

export function getStore(): UserStore {
  return data;
}

export function markDirty(): void {
  isDirty = true;
}
