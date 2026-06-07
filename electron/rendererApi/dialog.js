/* Electron imports */
const { ipcRenderer } = require("electron")

module.exports = {
  showOpenDialog: (options) => {
    return ipcRenderer.invoke('dialog:showOpenDialog', options)
  }
}