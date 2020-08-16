const { app, Menu } = require('electron')
const rendererProcessEvents = require('../events/rendererProcessEvents')
const { DeviceType }  = require('../const')
const isDev = require('electron-is-dev');

// default, configurable menus
let midiMenu = {
  label: 'Midi Settings',
  id: 'midi-settings',
  submenu: [
    {
      checked: true,
      type: "radio",
      label: "-Midi Off-"
    },
    {
      type: 'separator'
    },
    {
      label: "Scan for Midi Devices",
      click() {
        rendererProcessEvents.selectMidiScan()
      }
    }
  ]
}

let deviceMenu = {
  label: 'Device Type',
  id: 'device-settings',
  submenu: [
    {
      checked: true,
      type: "radio",
      label: "SampleRack",
      click() {
        rendererProcessEvents.selectDeviceType(DeviceType.SAMPLERACK)
      }
    },
    {
      checked: false,
      type: "radio",
      label: "SamplePad Pro",
      click() {
        rendererProcessEvents.selectDeviceType(DeviceType.SAMPLEPAD_PRO)
      }
    }
  ]
};

const getMenuTemplate = () => {
  const template = []

  if (process.platform === 'darwin') {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  template.push({
    label: 'Edit',
    submenu: [
      {
        label: 'Load SD Card',
        click() {
          rendererProcessEvents.loadSDCard()
        }
      },
      midiMenu,
      deviceMenu
    ]
  });

  let viewSubmenus = [
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]

  if (isDev || !isDev) {
    viewSubmenus.unshift({
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
      }
    })

    viewSubmenus.unshift({
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload()
      }
    })
  }

  template.push({
    label: 'View',
    submenu: viewSubmenus
  });

  template.push({
    role: 'window'
  });

  template.push({
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/LesserChance/samplepad-editor') }
      }
    ]
  })

  return template
}

module.exports = {
  getMenuTemplate: getMenuTemplate,
  regenerateMidiMenu: (midiInputs, currentMidiInput) => {
    if (!midiInputs) {
      midiInputs = []
    }

    midiMenu = {
      label: 'Midi Settings',
      id: 'midi-settings',
      submenu: [
        {
          checked: (currentMidiInput === null),
          type: "radio",
          label: "-Midi Off-",
          click() {
            rendererProcessEvents.selectMidiInput(null)
          }
        }
      ]
    }

    for (let i = 0; i < midiInputs.length; i++) {
      let midiInput = midiInputs[i]
      midiMenu.submenu.push({
        checked: (currentMidiInput === midiInput[0]),
        type: "radio",
        label: midiInput[1],
        click() {
          rendererProcessEvents.selectMidiInput(midiInput[0])
        }
      })
    }


    midiMenu.submenu.unshift({
      type: 'separator'
    });

    midiMenu.submenu.unshift({
      label: "Scan for Midi Devices",
      click() {
        rendererProcessEvents.selectMidiScan()
      }
    });

    const newMenu = Menu.buildFromTemplate(getMenuTemplate())
    Menu.setApplicationMenu(newMenu)
  },
  rengenerateDeviceMenu: (deviceType) => {
    deviceMenu.submenu[0].checked = (deviceType == DeviceType.SAMPLERACK);
    deviceMenu.submenu[1].checked = (deviceType == DeviceType.SAMPLEPAD_PRO);

    const newMenu = Menu.buildFromTemplate(getMenuTemplate())
    Menu.setApplicationMenu(newMenu)
  }
}