/* App imports */
import { Actions, Drive } from 'const'
import { showNotice } from 'actions/notice'
import { Sample } from 'state/models'
import { openSampleFileDialog } from 'util/fileDialog'
import { copySample } from 'util/storage'

/* Electron imports */
const Store = window.require('electron-store')
const fs = window.require('fs')
const path = window.require('path')

const MAX_FILENAME_LENGTH = 8

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
class SampleStore {

  constructor(settings) {
    this.store = new Store();

    /** @var deviceId => path */
    this.devicePaths = this.store.get('devicePaths') || {}

    /** @var deviceId => {fileName => fileNameOnDisk} */
    this.samples = this.store.get('samples') || {}

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
   * Get the string to write to a kit file for the given file
   * @param {String} fileName
   * @return {String}
   */
  getWriteFileName(fileName) {
    if (!fileName) {
      return ""
    }

    return this.deviceSamples[fileName].replace(Drive.SAMPLE_EXTENSION, "")
  }

  getFileNameFromKitFile(fileName) {
    if (!fileName) {
      return ""
    }

    let reverseList = this._getFlippedDeviceSamples()

    if (reverseList[fileName]) {
      return reverseList[fileName]
    }

    return fileName
  }

  /**
   * Open a file dialog, and move the selected files into the drive
   */
  importSamples() {
    return (dispatch, getState) => {
      openSampleFileDialog()
        .then(result => {
          if (result.canceled) {
            return null
          }

          dispatch(showNotice("is-warning", "Import processing..."))

          let state = getState()
          let fileCount = state.drive.samples.length

          // run the import on a timeout to let the notice above show
          setTimeout(() => {
            let hadCopyError = false

            let parseDirectory = (fileList) => {
              fileList.forEach((file) => {
                if (fileCount >= Drive.MAX_SAMPLES) {
                  return
                }

                let stats = fs.statSync(file)
                if (stats.isDirectory()) {
                  // read directories recursively
                  let dirFileList = fs.readdirSync(file)
                    .map((dirFile) => {
                      return file + "/" + dirFile
                    })

                  parseDirectory(dirFileList)
                } else {
                  let samplePath = path.parse(file)

                  if (samplePath.ext === Drive.SAMPLE_EXTENSION) {
                    let sample = this.addSample(samplePath.name, false)

                    try {
                      copySample(file, this.devicePath, sample.fileNameOnDisk)

                      // add the sample to the filename lists, so any subsequent copies will know its there
                      this._addFileReference(sample.fileName)
                      fileCount++
                    } catch (err) {
                      hadCopyError = true
                    }
                  }
                }
              })
            }

            parseDirectory(result.filePaths)
            this._saveSamples()

            dispatch({ type: Actions.RESET_SAMPLES, samples: Object.keys(this.deviceSamples) })

            if (hadCopyError) {
              dispatch(
                showNotice("is-warning", "There was a problem importing one or more samples.")
              )
            } else {
              dispatch(
                showNotice("is-success", "Samples successfully imported.")
              )
            }
          },100)
        })
    }
  }

  /**
   * Given a directory, load the sample list from disk if it already exists
   * otherwise read all the samples and store it to disk
   * @param {String} devicePath
   */
  loadSamplesFromDirectory(deviceId, devicePath) {
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
  addSample(fileName, save=true) {
    // if the sample already exists, do we want to overwrite it?
    if (this._fileExists(fileName)) {
      // overwriting a sample - remove references to it so it can be overwritten
      this._removeFileReference(fileName)
    }

    this.deviceSamples[fileName] = this._getFormattedFileName(fileName)

    if (save) {
      this._saveSamples()
    }

    return Sample(fileName, this.deviceSamples[fileName])
  }

  _getFlippedDeviceSamples() {
    let ret = {}
    Object.keys(this.deviceSamples).forEach(key => {
      ret[this.deviceSamples[key]] = key
    })
    return ret
  }

  _saveSamples() {
    this.samples[this.deviceId] = this.deviceSamples
    this.store.set('samples', this.samples)
    this._loadFilenames()

    return this
  }

  _saveDevicePath(devicePath) {
    this.devicePaths[this.deviceId] = devicePath
    this.store.set('devicePaths', this.devicePaths)

    return this
  }

  _reset() {
    this.store.set('devicePaths', {})
    this.store.set('samples', {})
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
    )

    /** the file names displayed to the user - this is used for uniqueness */
    this.fileNames = Object.fromEntries(
      Object.entries(this.deviceSamples).map(([fileName, fileNameOnDisk]) => [fileName.toLowerCase(), true])
    )
  }

  _fileExists(fileName) {
    return this.fileNames[(fileName).toLowerCase()] || false
  }

  _fileExistsOnDisk(fileName) {
    return this.fileNamesOnDisk[(fileName).toLowerCase()] || false
  }

  _removeFileReference(fileName) {
    delete this.fileNamesOnDisk[this.deviceSamples[fileName].toLowerCase()]
    delete this.fileNames[(fileName).toLowerCase()]
  }

  _addFileReference(fileName) {
    this.fileNamesOnDisk[this.deviceSamples[fileName].toLowerCase()] = true
    this.fileNames[(fileName).toLowerCase()] = true
  }

  _getFormattedFileName(displayName) {
    // drop the extension
    let fileName = displayName.substr(0, displayName.length - Drive.SAMPLE_EXTENSION.length)

    // remove any non-alphanumeric characters
    fileName = fileName.replace(/[^0-9a-z]/gi, '')

    // ideally, use the actual name or some portion of it, truncate it to a max length
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

      let testFileName = fileName.substr(0, insertPos) + fileCount
      if (!this._fileExistsOnDisk(testFileName + Drive.SAMPLE_EXTENSION)) {
        return testFileName + Drive.SAMPLE_EXTENSION
      }
    }
  }
}

export default new SampleStore()
