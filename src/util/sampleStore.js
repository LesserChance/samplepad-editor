/* App imports */
import { Drive } from 'const'

/* Electron imports */
const Store = window.require('electron-store')
const fs = window.require('fs')
const path = window.require('path')

const MAX_FILENAME_LENGTH = 8;

/**
 * responsible for managing sample file and display names
 *
 *  if a display name would be overwritten, its ok to overwrite its equivalent filename
 *    : kick.wav (stored as kick1.wav), when uploading another kick.wav should overwrite
 *
 *  but dont overwrite files that have been truncated
 *    : TR-909-KICK.wav (stored as TR-909-1.wav), when uploading a file called TR-909-1.wav
 *      it'd have to get renamed to not overwrite on disk
 */
class SampleStore extends Store {

  constructor(settings) {
    super(settings);

    /** @var deviceId => path */
    this.devicePaths = this.get('devicePaths') || {}

    /** @var deviceId => {fileName => fileNameOnDisk} */
    this.samples = this.get('samples') || {}

    /** @var all the samples on the current device {fileName => fileNameOnDisk} */
    this.deviceSamples = {}
  }

  getSamples() {
    return this.deviceSamples
  }

  getFileNameOnDisk(fileName) {
    return this.devicePath + "/" + this.deviceSamples[fileName]
  }

  /**
   * Given a directory, load the sample list from disk if it already exists
   * otherwise read all the samples and store it to disk
   * @param {String} devicePath
   */
  loadSamplesFromDirectory(devicePath) {
    let deviceId = fs.statSync(devicePath).dev

    if (this.samples[deviceId]) {
      // if we already have reference to this device, use the stored state
      this._loadDevice(deviceId)
    } else {
      // otherwise load state from disk
      this.deviceId = deviceId
      this.devicePath = devicePath

      this.deviceSamples = Object.fromEntries(
        fs.readdirSync(devicePath, {withFileTypes: true})
        .filter((dirent, index, arr) => {
          return dirent.isFile()
            && path.extname(dirent.name).toLowerCase() === Drive.SAMPLE_EXTENSION
            && !(/(^|\/)\.[^/.]/g).test(dirent.name)
        })
        .map((dirent) => {
          return [dirent.name, dirent.name]
        }))

      this
        ._saveSamples()
        ._saveDevicePath(devicePath)
    }
  }

  /**
   * Add a new file to the current device
   * @param {String} fileName
   */
  addSample(fileName) {
    // if the sample already exists, do we want to overwrite it?
    if (this._fileExists(fileName)) {
      // overwriting a sample - remove references to it so it can be overwritten
      this._removeFileReference(fileName)
    }

    this.deviceSamples[fileName] = this._getFormattedFileName(fileName)

    return this.saveSamples()
  }

  _saveSamples() {
    this.samples[this.deviceId] = this.deviceSamples
    this.set('samples', this.samples)
    this._loadFilenames()

    return this
  }

  _saveDevicePath(devicePath) {
    this.devicePaths[this.deviceId] = devicePath
    this.set('devicePaths', this.devicePaths)

    return this
  }

  _reset() {
    this.set('devicePaths', {})
    this.set('samples', {})
  }

  _loadDevice(deviceId) {
    this.deviceId = deviceId

    // todo: sort the samples by display name here
    this.devicePath = this.devicePaths[deviceId]
    this.deviceSamples = this.samples[deviceId]
    this._loadFilenames()
  }

  _loadFilenames() {
    /** the file names as stored on disk - this is used for r/w only, not file uniqueness */
    this.fileNamesOnDisk = Object.fromEntries(
      Object.entries(this.deviceSamples).map(([fileName, fileNameOnDisk]) => [fileNameOnDisk.toLowerCase(), true])
    );

    /** the file names displayed to the user - this is used for uniqueness */
    this.fileNames = Object.fromEntries(
      Object.entries(this.deviceSamples).map(([fileName, fileNameOnDisk]) => [fileName.toLowerCase(), true])
    );
  }

  _fileExists(fileName) {
    return this.fileNames[(fileName).toLowerCase()] || false
  }

  _fileExistsOnDisk(fileName) {
    return this.fileNamesOnDisk[(fileName).toLowerCase()] || false
  }

  _removeFileReference(fileName) {
    delete this.fileNames[(fileName).toLowerCase()]
    delete this.fileNamesOnDisk[(fileName).toLowerCase()]
  }

  _getFormattedFileName(displayName) {
    // drop the extension
    let fileName = displayName.substr(0, displayName.length - Drive.SAMPLE_EXTENSION.length)

    //ideally, use the actual name or some portion of it, truncate it to a max length
    fileName = fileName.substr(0, MAX_FILENAME_LENGTH)
    if (!this._fileExistsOnDisk(fileName + Drive.SAMPLE_EXTENSION)) {
      return fileName + Drive.SAMPLE_EXTENSION
    }

    // the best filename is already taken
    // start counting up from 0 and replacing characters at the end of the string
    // e.g. bassdrum.wav->bassdru1.wav...bassdr99.wav or kick.wav -> kick1.wav...kick3456.wav
    let count = 0
    let insertPos = fileName.length

    while (true) {
      count = count + 1
      let fileCount = '' + count

      while (insertPos > 0 && insertPos + fileCount.length > MAX_FILENAME_LENGTH) {
        insertPos--
      }

      if (insertPos === 0) {
        //shit, thats a lot of files with the same name, like d9999999.wav and they want to add more?
        throw new Error("Cannot import sample file")
      }

      let testFileName = fileName.substr(0, insertPos) + fileCount;
      if (!this._fileExistsOnDisk(testFileName + Drive.SAMPLE_EXTENSION)) {
        return testFileName + Drive.SAMPLE_EXTENSION
      }
    }
  }
}

export default new SampleStore();
