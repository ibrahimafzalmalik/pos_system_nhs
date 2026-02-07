/**
 * Database initialization: open DB, run migrations, seed.
 * Call once at app startup before creating BrowserWindow.
 */

import { initDatabase, persist } from "./database";
import { migrate } from "./migrate";
import { seed } from "./seed";

export async function initializeDatabase(): Promise<void> {
  console.log("[DB] Initializing database...");
  await initDatabase();
  migrate();
  seed();
  persist();
  console.log("[DB] Database ready.");
}

export { getDatabase, closeDatabase, initDatabase, persist } from "./database";
export { migrate } from "./migrate";
export { seed } from "./seed";
