/* Electron imports */
const Store = require('electron-store')

const store = new Store()

module.exports = {
  get: (param) => {
    return store.get(param)
  },
  save: (param, val) => {
    return store.set(param, val)
  }
}