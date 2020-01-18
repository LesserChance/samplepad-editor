import { Drive } from "../util/const";
const remote = window.require('electron').remote;

/**
 * Open a file dialog with appropriate file type filters for kits
 * @return {Promise}
 */
export function openKitFileDialog() {
  return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties:["openFile"],
    filters: [
      { name: 'Kits (* .' + Drive.KIT_FILE_TYPE + ')',
        extensions: [Drive.KIT_FILE_TYPE] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
}

/**
 * Open a file dialog with appropriate file type filters for samples
 * @return {Promise}
 */
export function openSampleFileDialog() {
  return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties:["openFile", 'multiSelections'],
    filters: [
      { name: 'wav (* .' + Drive.SAMPLE_FILE_TYPE + ')',
        extensions: [Drive.SAMPLE_FILE_TYPE] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
}
/**
 * Open a directory dialog
 * @return {Promise}
 */
export function openDriveDirectoryDialog() {
  return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties:["openDirectory"]
  })
}
