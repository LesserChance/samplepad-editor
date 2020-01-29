/* App imports */
import { Actions } from 'const';
import { showNotice } from 'actions/notice';
import { getGlobalStateFromDirectory } from 'state/globalState';
import { openDriveDirectoryDialog, openSampleFileDialog } from 'util/fileDialog';
import { storeLastLoadedDirectory, copySample } from 'util/storage';

/** DRIVE ACTION CREATORS */
/**
 * Open a file dialog, and parse the resulting directory as a SamplePad drive
 */
export function selectAndLoadDrive() {
  return (dispatch) => {
    openDriveDirectoryDialog()
      .then(result => {

        if (result.canceled) {
          return null;
        }

        storeLastLoadedDirectory(result.filePaths[0]);
        dispatch(loadDrive(result.filePaths[0]));
        dispatch(
          showNotice("is-success", "SD card and any existing samples and kits have been successfully loaded.")
        );
      })
  }
}
/**
 * Open a file dialog, and move the selected files into the drive
 */
export function importSamples() {
  return (dispatch, getState) => {
    openSampleFileDialog()
      .then(result => {
        if (result.canceled) {
          return null;
        }

        let state = getState();
        let newSamples = [];
        let hadCopyError = false;

        result.filePaths.forEach((file) => {
          try {
            let newSample = copySample(file, state.drive.rootPath);
            if (newSample) {
              newSamples.push(newSample);
            }
          } catch (err) {
            hadCopyError = true
          }
        })

        dispatch({ type: Actions.ADD_SAMPLES, samples: newSamples });

        if (hadCopyError) {
          dispatch(
            showNotice("is-warning", "There was a problem importing one or more samples.")
          );
        } else {
          dispatch(
            showNotice("is-success", "Samples successfully imported.")
          );
        }
      })
  }
}
/**
 * Parse kits, samples, and drive details from the given directory
 * @param {String} drivePath - root path of the SamplePad drive
 */
export function loadDrive(drivePath) {
  return (dispatch) => {
      let {drive, kits} = getGlobalStateFromDirectory(drivePath);

      dispatch({ type: Actions.LOAD_DRIVE, drive: drive });
      dispatch({ type: Actions.ADD_KITS, kits: kits });
      dispatch({ type: Actions.SORT_KITS });
  }
}
