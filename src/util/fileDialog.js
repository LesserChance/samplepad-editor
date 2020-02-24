/* App imports */
import { Drive } from 'const';

/* Electron imports */
const { dialog } = window.api;

/**
 * Open a file dialog with appropriate file type filters for kits
 * @return {Promise}
 */
export function openKitFileDialog() {
  return dialog.showOpenDialog({
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
  return dialog.showOpenDialog({
    title: 'Directories will recursivley load samples',
    properties:["openFile", 'multiSelections', 'openDirectory'],
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
  return dialog.showOpenDialog({
    properties:["openDirectory"]
  })
}
