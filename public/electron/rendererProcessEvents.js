const { ipcRenderer, BrowserWindow } = require("electron")

/**
 * This class is responsible for the renderer process receiving events
 * from the main process
 */
module.exports = {
  /**
   * tell the renderer process a main process event has happend
   * main process event: a midi device has been selected in the menu
   */
  selectMidiInput: (midiInput) => {
    let windows = BrowserWindow.getAllWindows()
    windows[0].webContents.send('selectMidiInput', midiInput)
  },
  /**
   * tell the renderer process a main process event has happend
   * main process event: the "scan for midi devices" menu item has been clicked
   */
  selectMidiScan: () => {
    let windows = BrowserWindow.getAllWindows()
    windows[0].webContents.send('midiScan', null)
  },

  /**
   * bind a renderer callback to the main processes
   * main process event: a midi device has been selected in the menu
   */
  setSelectMidiInputCallback: (callback) => {
    ipcRenderer.on('selectMidiInput', (event, inputIndex) => {
      callback(inputIndex)
    })
  },
  /**
   * bind a renderer callback to the main processes
   * main process event: the "scan for midi devices" menu item has been clicked
   */
  setSelectMidiScanCallback: (callback) => {
    ipcRenderer.on('midiScan', (event, inputIndex) => {
      callback(inputIndex)
    })
  }
}