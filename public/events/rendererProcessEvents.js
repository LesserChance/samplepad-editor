const { BrowserWindow } = require("electron")
const Events = require("./events")

/**
 * This class is responsible for the main process sending events
 * to the renderer process
 *
 * Any main event triggered that the renderer is allowed to respond
 * to needs to get triggered this way
 *
 * context: main
 */
module.exports = {
  /**
   * tell the renderer process a main process event has happened
   * main process event: a midi device has been selected in the menu
   */
  selectMidiInput: (midiInput) => {
    let windows = BrowserWindow.getAllWindows()
    windows[0].webContents.send(Events.SELECT_MIDI_INPUT, midiInput)
  },

  /**
   * tell the renderer process a main process event has happened
   * main process event: the "scan for midi devices" menu item has been clicked
   */
  selectMidiScan: () => {
    let windows = BrowserWindow.getAllWindows()
    windows[0].webContents.send(Events.SELECT_MIDI_SCAN, null)
  }
}