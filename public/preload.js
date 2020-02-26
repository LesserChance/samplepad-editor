/* Electron imports */
const { contextBridge } = require("electron")
const path = require('./node/path')
const wav = require('./node/wav')
const fs = require('./node/fs')
const store = require('./node/store')
const dialog = require('./node/dialog')
const midi = require('./node/midi')
const rendererProcessEvents = require('./electron/rendererProcessEvents')
const mainProcessEvents = require('./electron/mainProcessEvents')

// Initialize the apis that should be accessible from the renderer process
contextBridge.exposeInMainWorld(
  "api", {
    path: path,
    wav: wav,
    fs: fs,
    store: store,
    dialog: dialog,
    midi: midi,
    rendererProcessEvents: rendererProcessEvents
  }
)

// Initialize the renderer message handlers for communication with the main process
mainProcessEvents.initIpcRendererSender();