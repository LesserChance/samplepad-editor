const { ipcMain, ipcRenderer, Menu, BrowserWindow } = require('electron')
const { getMenuTemplate } = require('./menu')
const { rendererProcessEvents } = require('./rendererProcessEvents')

/**
 * This class is responsible for the main process receiving events
 * from the renderer process
 */
module.exports = {
  // renderer process sending events to main process
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

  // main process receiving events from renderer process
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
            checked: true,
            type: "radio",
            label: "-Midi Off-",
            click() {
              rendererProcessEvents.sendSelectMidiInput(null)
            }
          }
        ]
      }

      for (let i = 0; i < message.midiInputs.length; i++) {
        let midiInput = message.midiInputs[i]
        midiMenu.submenu.push({
          type: "radio",
          label: midiInput[1],
          click() {
            rendererProcessEvents.sendSelectMidiInput(midiInput[0])
          }
        })
      }

      const newMenu = Menu.buildFromTemplate(getMenuTemplate(midiMenu))
      Menu.setApplicationMenu(newMenu)
    });
  }
}