/**
 * Runs schema.sql to create tables if they do not exist.
 * Safe to run multiple times.
 */

import * as fs from "fs";
import * as path from "path";
import { getDatabase } from "./database";

const SCHEMA_FILE = "schema.sql";

export function migrate(): void {
  const db = getDatabase();
  const schemaPath = path.join(process.cwd(), "server", "db", SCHEMA_FILE);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`[Migrate] Schema file not found: ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(sql);

  const createdTables: string[] = [];
  const matchAll = sql.matchAll(/CREATE TABLE IF NOT EXISTS\s+(\w+)/gi);
  for (const m of matchAll) {
    createdTables.push(m[1]);
  }
  console.log("[Migrate] Schema applied. Tables:", createdTables.join(", "));
}
