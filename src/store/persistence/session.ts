import fs from "fs";

const FILE_PATH = "src/store/sessions.json";

let data: Session[] = [];
let isDirty = false;
let isWriting = false;

export function init(): void {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    data = JSON.parse(raw) as Session[];
  } catch {
    data = [];
  }
}

function shouldPersist() {
  return isDirty && !isWriting;
}

export function persist() {
  if (!shouldPersist()) return;

  isWriting = true;
  isDirty = false;

  fs.writeFile(FILE_PATH, JSON.stringify(data), () => {
    isWriting = false;
  });
}

export function getStore(): Session[] {
  return data;
}

export function markDirty(): void {
  isDirty = true;
}
