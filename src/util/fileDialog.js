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
    title: 'Import kit',
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
    title: 'Import Sample(s)',
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
    title: 'Load SamplePad Root Directory',
    properties:["openDirectory"]
  })
}
