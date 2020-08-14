const { ipcMain, ipcRenderer } = require('electron')
const { regenerateMidiMenu, rengenerateDeviceMenu } = require('../mainApi/menu')
const Events = require("./events")

/**
 * This class is responsible for the main process receiving events
 * from the renderer process
 *
 * every main process event that can be triggered from the renderer process
 * needs an associated event handler in initIpcMainReceiver
 */
module.exports = {
  /**
   * Initialize functionality for the
   * renderer process to send events to main process
   */
  initIpcRendererSender:() => {
    process.once('loaded', () => {
      window.addEventListener('message', event => {
        const message = event.data

        if (message.type) {
          ipcRenderer.send(message.type, message)
        }
      });
    });
  },

  /**
   * Initialize functionality for the
   * main process to receive events from the renderer process
   *
   * This can only be called in a context where we have an active renderer process
   *
   * renderer triggers to the main process are what cause these events to fire
   */
  initIpcMainReceiver: () => {
    ipcMain.on(Events.GENERATE_MIDI_MENU, (event, message) => {
      // context: main
      // the renderer process wants the midi menu regenerated
      regenerateMidiMenu(message.midiInputs, message.currentMidiInput)
    });

    ipcMain.on(Events.SET_DEVICE_TYPE, (event, message) => {
      // context: main
      // the renderer process wants to select a new device type
      rengenerateDeviceMenu(message.deviceType)
    });
  }
}