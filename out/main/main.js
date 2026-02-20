"use strict";
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const mainProcessEvents = require("./events/mainProcessEvents");
const { getMenuTemplate } = require("./mainApi/menu");
let mainWindow;
ipcMain.handle("dialog:showOpenDialog", async (event, options) => {
  return dialog.showOpenDialog(options);
});
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1e3,
    height: 780,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "../preload/preload.js")
    }
  });
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => mainWindow = null);
  const menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);
  mainProcessEvents.initIpcMainReceiver();
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
