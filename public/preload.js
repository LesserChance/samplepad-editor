/* Electron imports */
const { contextBridge } = require("electron")
const path = require('./node/path')
const wav = require('./node/wav')
const fs = require('./node/fs')
const store = require('./node/store')
const dialog = require('./node/dialog')
const midi = require('./node/midi')

contextBridge.exposeInMainWorld(
  "api", {
    path: path,
    wav: wav,
    fs: fs,
    store: store,
    dialog: dialog,
    midi: midi
  }
)