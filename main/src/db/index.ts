/**
 * Main process database layer (better-sqlite3).
 * Module 2 backend - Nisar Paint & Hardware Store POS.
 */

export { getDb, ensureDbDirExists } from "./db";
export { migrate } from "./migrate";
export { productsRepo } from "./productsRepo";
