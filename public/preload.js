/* Electron imports */
const { contextBridge } = require("electron")
const path = require('./rendererApi/path')
const wav = require('./rendererApi/wav')
const fs = require('./rendererApi/fs')
const store = require('./rendererApi/store')
const dialog = require('./rendererApi/dialog')
const midi = require('./rendererApi/midi')

const rendererProcessEvents = require('./events/rendererProcessEvents')
const mainProcessEvents = require('./events/mainProcessEvents')

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