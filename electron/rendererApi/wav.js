const spawn = require('child_process').spawn

let wavSpawn = {}

const playLinuxWavFile = (wavId, path) => {
  const players = [
    ['paplay', [path]],
    ['aplay', [path]]
  ]

  return new Promise((resolve, reject) => {
    const failures = []

    const startPlayer = (index) => {
      if (index >= players.length) {
        reject(new Error(`Unable to play WAV file: ${failures.join('; ')}`))
        return
      }

      const [command, args] = players[index]
      let child

      try {
        child = spawn(command, args)
      } catch (error) {
        failures.push(`${command}: ${error.message}`)
        startPlayer(index + 1)
        return
      }

      wavSpawn[wavId] = child
      let settled = false

      const tryNextPlayer = (message) => {
        if (settled) {
          return
        }

        settled = true
        if (wavSpawn[wavId] === child) {
          delete wavSpawn[wavId]
        }
        failures.push(`${command}: ${message}`)
        startPlayer(index + 1)
      }

      child.once('error', (error) => {
        tryNextPlayer(error.message)
      })

      child.once('close', (code, signal) => {
        if (settled) {
          return
        }

        if (code === 0) {
          settled = true
          if (wavSpawn[wavId] === child) {
            delete wavSpawn[wavId]
          }
          resolve()
          return
        }

        tryNextPlayer(signal ? `terminated by ${signal}` : `exited with code ${code}`)
      })
    }

    startPlayer(0)
  })
}

module.exports = {
  playWavFile: (wavId, path) => {
    if (process.platform === 'linux') {
      return playLinuxWavFile(wavId, path)
    }

    return new Promise((resolve, reject) => {
      switch (process.platform) {
        case 'darwin':
          wavSpawn[wavId] = spawn('afplay', [path])
          break
        case 'win32':
          wavSpawn[wavId] = spawn('powershell', [
            '-c',
            '(New-Object System.Media.SoundPlayer "' + path + '").PlaySync()'
          ])
          wavSpawn[wavId].stdin.end()
          break
        default:
          resolve()
          break
      }

      wavSpawn[wavId].on('close', (code) => {
        resolve()
      })
    })
  },
  stopWavFile: (wavId) => {
    if (wavSpawn[wavId]) {
      wavSpawn[wavId].removeAllListeners('close')
      wavSpawn[wavId].removeAllListeners('error')
      wavSpawn[wavId].kill()
      delete wavSpawn[wavId]
    }
  }
}