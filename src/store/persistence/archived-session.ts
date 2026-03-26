import fs from "fs";

const ARCHIVE_FILE_PATH = "src/store/sessions-archive.json";

export async function save(sessions: Session[]): Promise<void> {
  let archive: Session[] = [];
  try {
    const raw = await fs.promises.readFile(ARCHIVE_FILE_PATH, "utf8");
    archive = JSON.parse(raw);
  } catch {
    archive = [];
  }

  archive.push(...sessions);
  await fs.promises.writeFile(ARCHIVE_FILE_PATH, JSON.stringify(archive));
}
