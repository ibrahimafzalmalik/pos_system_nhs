/**
 * Electron main process.
 * Initializes SQLite DB (migrate + seed) before creating the window.
 * On DB failure: show error dialog and exit.
 */

import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";
import { initializeDatabase } from "../server/db";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(app.getAppPath(), "index.html")).catch((err) => {
    console.error("[Main] Failed to load index.html", err);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function bootstrap(): Promise<void> {
  try {
    console.log("[Main] Starting application...");
    await initializeDatabase();
    createWindow();
    console.log("[Main] Window created.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Main] Database initialization failed:", message);
    dialog.showErrorBox(
      "Database Error",
      `Could not initialize the database.\n\n${message}\n\nThe application will exit.`
    );
    app.exit(1);
  }
}

app.whenReady().then(() => bootstrap());

app.on("window-all-closed", () => {
  const { closeDatabase } = require("../server/db");
  closeDatabase();
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
