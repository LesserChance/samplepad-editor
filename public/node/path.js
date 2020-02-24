/* Electron imports */
const path = require('path')

module.exports = {
  parse: (fileName) => {
    return path.parse(fileName)
  }
}