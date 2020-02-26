const { ipcMain, ipcRenderer } = require('electron')
const { regenerateMidiMenu } = require('../mainApi/menu')

/**
 * This class is responsible for the main process receiving events
 * from the renderer process
 */
module.exports = {
  /**
   * Initialize functionality for the
   * renderer process to send events to main process
   */
  initIpcRendererSender:() => {
    process.once('loaded', () => {
      window.addEventListener('message', event => {
        const message = event.data;

        switch (message.type) {
          case 'setMidiMenu':
            // context: renderer
            // the renderer process wants the midi menu regenerated
            ipcRenderer.send('setMidiMenu', message);
            break
          default:
            break
        }
      });
    });
  },

  /**
   * Initialize functionality for the
   * main process to receive events from the renderer process
   *
   * This can only be called in a context where we have an active renderer process
   */
  initIpcMainReceiver: () => {
    ipcMain.on('setMidiMenu', (event, message) => {
      // context: main
      // the renderer process wants the midi menu regenerated
      regenerateMidiMenu(message.midiInputs, message.currentMidiInput)
    });
  }
}