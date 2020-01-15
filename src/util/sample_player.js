const remote = window.require('electron').remote;
const fs = window.require('fs');
const spawn = window.require('child_process').spawn;

class SamplePlayer {
  constructor() {
    this.os = remote.process.platform;
    this.child = null;
  }

  async play(path) {
    return new Promise((resolve, reject) => {
      switch (this.os) {
        case 'darwin':
          this.child = spawn('afplay', [path]);
          break;
        case 'win32':
          this.child = spawn('powershell', [
            '-c',
            '(New-Object System.Media.SoundPlayer "' + path + '").PlaySync();'
          ]);
          this.child.stdin.end();
          break;
        default:
          resolve();
          break;
      }

      this.child.on('close', (code) => {
        resolve();
      });
    });
  }

  stop() {
    this.child.removeAllListeners('close');
    if (this.child) {
      this.child.kill();
    }
  };
}

export default SamplePlayer;