/**
 * SQLite database singleton for Electron main process (sql.js - no native build).
 * Uses %APPDATA%/Nisar Paint & Hardware Store POS/pos.db
 */

import * as fs from "fs";
import * as path from "path";
import initSqlJs, { Database as SqlJsDatabase } from "sql.js";

const APP_FOLDER = "Nisar Paint & Hardware Store POS";
const DB_FILE = "pos.db";

let db: SqlJsDatabase | null = null;
let dbPath: string = "";

/**
 * Resolves the database directory and ensures it exists.
 * Uses process.env.APPDATA on Windows.
 */
function getDbPath(): string {
  const appData = process.env.APPDATA;
  if (!appData) {
    throw new Error(
      "[DB] APPDATA is not set. Cannot resolve database directory."
    );
  }
  const dir = path.join(appData, APP_FOLDER);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("[DB] Created app data directory:", dir);
  }
  return path.join(dir, DB_FILE);
}

/**
 * Persists the in-memory database to disk. Call after migrate/seed or before close.
 */
export function persist(): void {
  if (db !== null && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log("[DB] Persisted to disk.");
  }
}

/**
 * Opens the SQLite database (loads from file if exists, else creates new).
 * Must be called after initDatabase() has completed. Returns the same instance (singleton).
 */
export function getDatabase(): SqlJsDatabase {
  if (db === null) {
    throw new Error(
      "[DB] Database not initialized. Call initDatabase() first (await it at startup)."
    );
  }
  return db;
}

/**
 * Initializes the database (async). Loads sql.js, creates/loads DB file, enables foreign keys.
 * Call once at app startup before migrate() and seed().
 */
export async function initDatabase(): Promise<void> {
  if (db !== null) {
    return;
  }
  dbPath = getDbPath();
  console.log("[DB] Opening database at:", dbPath);

  const SQL = await initSqlJs();
  let buffer: Uint8Array | undefined;
  if (fs.existsSync(dbPath)) {
    buffer = new Uint8Array(fs.readFileSync(dbPath));
  }
  db = new SQL.Database(buffer);
  db.run("PRAGMA foreign_keys = ON;");
  console.log("[DB] Foreign keys enabled.");
}

/**
 * Closes the database and persists to disk. Call when app is quitting.
 */
export function closeDatabase(): void {
  if (db !== null) {
    persist();
    db.close();
    db = null;
    console.log("[DB] Connection closed.");
  }
}
