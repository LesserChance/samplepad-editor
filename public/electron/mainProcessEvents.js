const { ipcMain, ipcRenderer, Menu, BrowserWindow } = require('electron')
const { getMenuTemplate } = require('./menu')
const rendererProcessEvents = require('./rendererProcessEvents')

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
      if (!message.midiInputs) {
        return
      }

      let midiMenu = {
        label: 'Midi Settings',
        id: 'midi-settings',
        submenu: [
          {
            checked: (message.currentMidiInput === null),
            type: "radio",
            label: "-Midi Off-",
            click() {
              rendererProcessEvents.selectMidiInput(null)
            }
          }
        ]
      }

      for (let i = 0; i < message.midiInputs.length; i++) {
        let midiInput = message.midiInputs[i]
        midiMenu.submenu.push({
          checked: (message.currentMidiInput === midiInput[0]),
          type: "radio",
          label: midiInput[1],
          click() {
            rendererProcessEvents.selectMidiInput(midiInput[0])
          }
        })
      }

      const newMenu = Menu.buildFromTemplate(getMenuTemplate(midiMenu))
      Menu.setApplicationMenu(newMenu)
    });
  }
}