import * as fs from "fs";
import * as path from "path";
import Database from "better-sqlite3";
import { app } from "electron";

let db: Database.Database | null = null;

function getDbPath(): string {
  if (app.isPackaged) {
    return path.join(app.getPath("userData"), "pos.db");
  }
  try {
    const root = process.cwd();
    return path.join(root, "pos.dev.db");
  } catch {
    return path.join(app.getPath("userData"), "pos.dev.db");
  }
}

export function ensureDbDirExists(dbPath: string): void {
  const dir = path.dirname(dbPath);
  fs.mkdirSync(dir, { recursive: true });
}

function applyPragmas(conn: Database.Database): void {
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  conn.pragma("busy_timeout = 5000");
}

export function getDb(): Database.Database {
  if (db !== null) return db;
  const dbPath = getDbPath();
  ensureDbDirExists(dbPath);
  db = new Database(dbPath);
  applyPragmas(db);
  return db;
}
