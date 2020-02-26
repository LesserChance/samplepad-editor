const { ipcRenderer, BrowserWindow } = require("electron")

/**
 * This class is responsible for the renderer process receiving events
 * from the main process
 */
module.exports = {
  // main process sending events to renderer process
  sendSelectMidiInput: (midiInput) => {
    let windows = BrowserWindow.getAllWindows()
    windows[0].webContents.send('selectMidiInput', null)
  },

  // renderer process receiving events from main process
  setSelectMidiInputCallback: (callback) => {
    ipcRenderer.on('selectMidiInput', (event, inputIndex) => {
      callback(inputIndex)
    })
  }
}