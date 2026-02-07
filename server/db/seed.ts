/**
 * Seeds admin user and default settings only if they do not exist.
 * Safe to run multiple times.
 */

import * as crypto from "crypto";
import { getDatabase } from "./database";

const ADMIN_USERNAME = "admin";
const ADMIN_PLAIN_PASSWORD = "admin123";
const DEFAULT_SHOP_NAME = "Nisar Paint & Hardware Store POS";
const DEFAULT_RECEIPT_FOOTER = "Thank you for shopping!";

function hashPassword(password: string): string {
  const salt = "nisar_pos_seed_salt";
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function seed(): void {
  const db = getDatabase();

  // Admin user (only if no user with username 'admin')
  const stmt = db.prepare("SELECT id FROM users WHERE username = ?");
  stmt.bind([ADMIN_USERNAME]);
  const hasAdmin = stmt.step();
  stmt.free();

  if (!hasAdmin) {
    const hash = hashPassword(ADMIN_PLAIN_PASSWORD);
    db.run(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [ADMIN_USERNAME, hash, "ADMIN"]
    );
    console.log("[Seed] Admin user created (username: admin).");
  } else {
    console.log("[Seed] Admin user already exists, skipped.");
  }

  // Default settings (insert only if key missing)
  const settings = [
    { key: "shop_name", value: DEFAULT_SHOP_NAME },
    { key: "receipt_footer", value: DEFAULT_RECEIPT_FOOTER },
  ];

  for (const { key, value } of settings) {
    db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", [
      key,
      value,
    ]);
    if (db.getRowsModified() > 0) {
      console.log("[Seed] Setting added:", key, "=", value);
    }
  }
  console.log("[Seed] Seed completed.");
}
