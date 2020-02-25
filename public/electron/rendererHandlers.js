const { ipcMain, ipcRenderer, Menu, MenuItem } = require('electron')
const { getMenuTemplate } = require('./menu')

module.exports = {
  initIpcRendererSender:() => {
    process.once('loaded', () => {
      window.addEventListener('message', event => {
        const message = event.data;

        switch (message.type) {
          case 'setMidiMenu':
            ipcRenderer.send('setMidiMenu', message);
            break;
        }
      });
    });
  },

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
            label: "-Midi Off-"
          }
        ]
      }

      for (let i = 0; i < message.midiInputs.length; i++) {
        let midiInput = message.midiInputs[i]
        midiMenu.submenu.push({
           type: "radio",
           label: midiInput[1],
           click() {
            console.log(midiInput[0])
          }
        })
      }

      const newMenu = Menu.buildFromTemplate(getMenuTemplate(midiMenu))
      Menu.setApplicationMenu(newMenu)
    });
  }
}