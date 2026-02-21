const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')
const mainProcessEvents = require('./events/mainProcessEvents')
const { getMenuTemplate } = require('./mainApi/menu')

// Initialize electron-store in main process (required for contextIsolation: true)
const store = new Store()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 780,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
  }

  mainWindow.on('closed', () => mainWindow = null)

  // Initialize the menu
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  // Initialize the renderer message handlers
  mainProcessEvents.initIpcMainReceiver()
}

// Dialog IPC handler (replaces removed remote.dialog)
ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
  return dialog.showOpenDialog(options)
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
