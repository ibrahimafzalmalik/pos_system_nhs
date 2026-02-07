/**
 * Electron main process.
 * Runs migrations, then creates the window.
 * On DB/migration failure: show error dialog and exit.
 */

import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";
import { migrate } from "../main/src/db";
import { registerProductsIpc } from "../main/src/ipc/productsIpc";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  const preloadPath = path.join(__dirname, "..", "main", "src", "preload.js");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  const uiPath = path.join(app.getAppPath(), "dist-ui", "index.html");
  mainWindow.loadFile(uiPath).catch((err) => {
    console.error("[Main] Failed to load UI", err);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function bootstrap(): void {
  try {
    console.log("[Main] Starting application...");
    migrate();
    registerProductsIpc();
    createWindow();
    console.log("[Main] Window created.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Main] Migration failed:", message);
    dialog.showErrorBox(
      "Migration Error",
      `Database migration failed.\n\n${message}\n\nThe application will exit.`
    );
    app.exit(1);
  }
}

app.whenReady().then(() => bootstrap());

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
