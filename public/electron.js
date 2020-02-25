const { app, BrowserWindow, Menu } = require('electron')
const path = require('path');
const isDev = require('electron-is-dev');
const rendererHandlers = require('./electron/rendererHandlers')
const { getMenuTemplate } = require('./electron/menu')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 780,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, isDev ? "preload.js" : "build/preload.js")
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);

  // Initialize the menu
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  // Initialize the renderer message handlers
  rendererHandlers.initIpcMainReceiver();
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
