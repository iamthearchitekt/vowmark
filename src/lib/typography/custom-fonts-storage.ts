import fs from "fs";
import path from "path";
import { FontRecord } from "./fonts-db";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "custom-fonts.json");

export function loadPersistentCustomFonts(): FontRecord[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(data) as FontRecord[];
    }
  } catch (err) {
    console.warn("Failed to load persistent custom fonts:", err);
  }
  return [];
}

export function savePersistentCustomFontsBulk(fonts: FontRecord[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const existing = loadPersistentCustomFonts();
    const existingIds = new Set(existing.map((f) => f.id));
    const merged = [...existing, ...fonts.filter((f) => !existingIds.has(f.id))];
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to bulk save custom fonts persistently:", err);
  }
}
