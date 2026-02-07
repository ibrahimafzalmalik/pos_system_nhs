import * as fs from "fs";
import * as path from "path";
import { getDb } from "./db";
import { log } from "../utils/log";

const MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function getMigrationsDir(): string {
  const nextToScript = path.join(__dirname, "migrations");
  if (fs.existsSync(nextToScript)) return nextToScript;
  return path.resolve(process.cwd(), "main", "src", "db", "migrations");
}

export function migrate(): void {
  const db = getDb();
  db.exec(MIGRATIONS_TABLE);

  const migrationsDir = getMigrationsDir();
  if (!fs.existsSync(migrationsDir)) {
    log("No migrations directory at", migrationsDir);
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const rows = db.prepare("SELECT name FROM _migrations").all() as { name: string }[];
  const applied = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) continue;

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8").trim();
    if (!sql) continue;

    const run = db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
    });
    run();
    log("Applied migration:", file);
  }
}
