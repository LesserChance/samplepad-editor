const { ipcRenderer } = require("electron")
const Events = require("./events")

/**
 * This class is responsible for the renderer process receiving events
 * from the main process
 *
 * Any main event triggered that the renderer is allowed to respond
 * to needs to have an associated callback bound here
 *
 * context: renderer
 */
module.exports = {
  /**
   * bind a renderer callback to the main processes
   * main process event: a midi device has been selected in the menu
   */
  setSelectMidiInputCallback: (callback) => {
    ipcRenderer.on(Events.SELECT_MIDI_INPUT, (event, inputIndex) => {
      callback(inputIndex)
    })
  },

  /**
   * bind a renderer callback to the main processes
   * main process event: the "scan for midi devices" menu item has been clicked
   */
  setSelectMidiScanCallback: (callback) => {
    ipcRenderer.on(Events.SELECT_MIDI_SCAN, (event, inputIndex) => {
      callback(inputIndex)
    })
  },

  /**
   * bind a renderer callback to the main processes
   * main process event: a new device type has been selected
   */
  setSelectDeviceTypeCallback: (callback) => {
    ipcRenderer.on(Events.SELECT_DEVICE_TYPE, (event, deviceType) => {
      callback(deviceType)
    })
  },

  /**
   * bind a renderer callback to the main processes
   * main process event: load SD Card has been clicked
   */
  setLoadSDCardCallback: (callback) => {
    ipcRenderer.on(Events.LOAD_SD_CARD, (event) => {
      callback()
    })
  }
}