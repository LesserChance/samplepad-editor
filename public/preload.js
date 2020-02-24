/* Electron imports */
const { contextBridge, remote } = require("electron")
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const Store = require('electron-store')

const store = new Store()
let wavSpawn = null

contextBridge.exposeInMainWorld(
  "api", {
    path: {
      extensionUpper: (fileName) => {
        return path.extname(fileName).toUpperCase()
      },
      extensionLower: (fileName) => {
        return path.extname(fileName).toLowerCase()
      },
      parse: (fileName) => {
        return path.parse(fileName)
      },
    },

    // wav file player
    playWavFile: (path) => {
      return new Promise((resolve, reject) => {
        switch (remote.process.platform) {
          case 'darwin':
            wavSpawn = spawn('afplay', [path])
            break
          case 'win32':
            wavSpawn = spawn('powershell', [
              '-c',
              '(New-Object System.Media.SoundPlayer "' + path + '").PlaySync()'
            ])
            wavSpawn.stdin.end()
            break
          default:
            resolve()
            break
        }

        wavSpawn.on('close', (code) => {
          resolve()
        })
      })
    },
    stopWavFile: () => {
      if (wavSpawn) {
        wavSpawn.removeAllListeners('close')
        if (wavSpawn) {
          wavSpawn.kill()
        }
      }
    },

    // file
    fs: {
      exists: (file) => {
        return fs.existsSync(file)
      },
      isDirectory: (file) => {
        let stats = fs.statSync(file)
        return stats.isDirectory()
      },
      mkdir: (file) => {
        return fs.mkdirSync(file)
      },
      renameFile: (source, destination) => {
        return fs.renameSync(source, destination)
      },
      readFileAsString: (file) => {
        return fs.readFileSync(file, "utf8")
      },
      readFileBufferArray: (file) => {
        return fs.readFileSync(file)
      },
      writeFile: (file, content) => {
        return fs.writeFileSync(file, content)
      },
      getFileListFromDirectory: (dirPath) => {
        return fs.readdirSync(dirPath)
          .map((dirFile) => {
            return dirPath + "/" + dirFile
          })
      },
      getSampleFiles: (sampleDirectoryPath) => {
        return fs.readdirSync(sampleDirectoryPath, {withFileTypes: true})
          .filter((dirent) => {
            return dirent.isFile()
              && path.extname(dirent.name).toUpperCase() === ".WAV"
              && !(/(^|\/)\.[^/.]/g).test(dirent.name)
          })
      },
      getKitFiles: (kitPath) => {
        return fs.readdirSync(kitPath, {withFileTypes: true})
          .filter((dirent) => {
            return dirent.isFile()
              && path.extname(dirent.name).toUpperCase() === ".KIT"
              && !(/(^|\/)\.[^/.]/g).test(dirent.name)
          })
      }
    },

    // store
    getFromStore: (param) => {
      return store.get(param)
    },
    saveToStore: (param, val) => {
      return store.set(param, val)
    },

    // dialog
    showOpenDialog: (options) => {
      return remote.dialog.showOpenDialog(options)
    }
  }
)