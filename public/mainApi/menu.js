const { app, Menu } = require('electron')
const rendererProcessEvents = require('../events/rendererProcessEvents')
const isDev = require('electron-is-dev');

const getMenuTemplate = (midiMenu) => {
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

  if (!midiMenu) {
    midiMenu = {
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
  }

  midiMenu.submenu.unshift({ type: 'separator' })
  midiMenu.submenu.unshift({
    label: "Scan for Midi Devices",
    click() {
      rendererProcessEvents.selectMidiScan()
    }
  })

  template.push({
    label: 'Edit',
    submenu: [
      midiMenu
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

    let midiMenu = {
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

    const newMenu = Menu.buildFromTemplate(getMenuTemplate(midiMenu))
    Menu.setApplicationMenu(newMenu)
  }
}