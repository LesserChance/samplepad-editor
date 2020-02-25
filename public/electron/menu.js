const { Menu, app } = require('electron')
const isDev = require('electron-is-dev');

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
      label: 'Midi Settings',
      submenu: [
        {
          label: '[0] Name'
        }
      ]
    }
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

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)