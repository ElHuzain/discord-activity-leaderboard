import fs from "fs";

const FILE_PATH = "src/store/users.json";

let data: User[] = [];
let isDirty = false;

export function init(): void {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    data = JSON.parse(raw) as User[];
  } catch {
    data = [];
  }

  setInterval(() => {
    if (!isDirty) return;
    fs.writeFile(FILE_PATH, JSON.stringify(data), () => {});
    isDirty = false;
  }, 500);
}

export function getStore(): User[] {
  return data;
}

export function markDirty(): void {
  isDirty = true;
}
