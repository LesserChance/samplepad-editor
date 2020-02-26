/* Electron imports */
const { remote } = require("electron")

module.exports = {
  showOpenDialog: (options) => {
    return remote.dialog.showOpenDialog(options)
  }
}