/* App imports */
import { KitModel, PadModel } from "redux/models";
import { Actions, MidiMap, PadErrors } from 'util/const'
import { openKitFileDialog, openDriveDirectoryDialog, openSampleFileDialog} from "util/fileDialog";
import { getGlobalStateFromDirectory} from "util/globalState";
import { getKitAndPadsFromFile } from "util/kitFile";
import { storeLastLoadedDirectory, saveKitToFile, copySample, kitWillOverwriteExisting } from "util/storage";

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
        result.filePaths.forEach((file) => {
          let newSample = copySample(file, state.drive.rootPath);
          if (newSample) {
            newSamples.push(newSample);
          }
        })

        dispatch({ type: Actions.ADD_SAMPLES, samples: newSamples });
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
  }
}

/** KIT ACTION CREATORS */
/**
 * Open a file dialog, and parse the resulting file as a SamplePad kit
 */
export function importKitFromFile() {
  return (dispatch) => {
    openKitFileDialog()
      .then(result => {
        if (result.canceled) {
          return null;
        }

        let {kit, pads} = getKitAndPadsFromFile(result.filePaths[0]);

        // remove the filename, as a new one will get created
        kit.fileName = null;

        dispatch({ type: Actions.ADD_PADS, pads: pads });
        dispatch({ type: Actions.ADD_KIT, kit: kit });
        dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kit.id });
        dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kit.id });
        dispatch({ type: Actions.SORT_KITS });
      })
  }
}
/**
 * load kit details from kit file
 * @param {String} kitId
 */
export function loadKitDetails(kitId) {
  return (dispatch, getState) => {
    let state = getState();
    let kit = state.kits.models[kitId];

    if (!kit.isLoaded) {
      let kitFile = kit.filePath + "/" + kit.fileName;

      try {
        let result = getKitAndPadsFromFile(kitFile);

        dispatch({ type: Actions.ADD_PADS, pads: result.pads });
        dispatch(updateKitState(kitId, {
          "isLoaded": true,
          "kitName": result.kit.kitName,
          "pads": result.kit.pads
        }));
        dispatch({ type: Actions.SORT_KITS });
      } catch (err) {
        // failed kit load - load a default empty kit
        dispatch(loadNewKit({
          id: kit.id,
          isNew: kit.isNew,
          isExisting: kit.isExisting,
          isLoaded: kit.isLoaded,
          filePath: kit.filePath,
          fileName: kit.fileName,
          kitName: kit.kitName,
          originalKitName: kit.kitName,
        }));
      }
    }
  }
}
/**
 * create an empty kit and add it to the kit list
 */
export function loadNewKit(presetData=null) {
  return (dispatch, getState) => {
    let state = getState();

    // create a default set of samples
    let pads = {};

    Object.keys(MidiMap).forEach((padType) => {
      let midiNote = MidiMap[padType][1];
      let pad = PadModel.getPad(padType)
      pad.midiNote = midiNote;
      pads[pad.id] = pad;
    });

    let kit = KitModel(
      state.drive.kitPath,
      null,
      true,
      false,
      true,
      "",
      Object.keys(pads)
    );

    if (presetData) {
      // right now this is only used in the case where an existing kit load failure occurs
      kit = {...kit, ...presetData};
    }

    dispatch({ type: Actions.ADD_PADS, pads: pads });
    dispatch({ type: Actions.ADD_KIT, kit: kit });
    dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kit.id });
    dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kit.id });
    dispatch({ type: Actions.SORT_KITS });
  }
}
/**
 * save a kit to disk
 * @param {boolean} asNew=false - if true, save this kit as a new kit on disk, do not overwrite the exitings
 */
export function saveKit(kitId, asNew=false, confirmedOverwrite=false) {
  return (dispatch, getState) => {
    let state = getState();
    let kit = state.kits.models[kitId];

    // validate the kit
    for (let i = 0; i < kit.pads.length; i++) {
      let pad = state.pads[kit.pads[i]];
      if (pad.errors.length) {
        dispatch({ type: Actions.SHOW_MODAL_KIT_ERRORS });
        return;
      }
    }

    // if this kit would overwrite an existing one - confirm first
    if (!confirmedOverwrite) {
      let confirm = kitWillOverwriteExisting(kit, asNew);

      if (confirm) {
        // show the warning modal - on confirm, save the kit
        dispatch(confirmFileOverwrite((result) => {
          return (dispatch, getState) => {
            if (result) {
              dispatch(saveKit(kitId, asNew, true));
            }
          }
        }));
        return;
      }
    }

    let fileName = saveKitToFile(kit, state.pads, asNew);

    dispatch(updateKitState(kitId, {
      isNew: false,
      isExisting: true,
      originalKitName: kit.kitName,
      fileName: fileName
    }));
    dispatch({ type: Actions.SORT_KITS });
  }
}
/**
 * Update the kit name and filename
 * @param {String} kitId
 * @param {?} value
 */
export function updateKitName(kitId, value) {
  return (dispatch, getState) => {
    dispatch(updateKitProperty(kitId, 'kitName', value));
    dispatch({ type: Actions.SORT_KITS });
  }
}
/**
 * Update an individual property of a kit
 * @param {String} kitId
 * @param {String} property
 * @param {?} value
 */
export function updateKitProperty(kitId, property, value) {
  return { type: Actions.UPDATE_KIT_PROPERTY, kitId: kitId, property: property, value: value }
}
/**
 * Update multiple properties of a kit
 * @param {String} kitId
 * @param {json} newState
 */
export function updateKitState(kitId, newState) {
  return { type: Actions.UPDATE_KIT_STATE, kitId: kitId, newState: newState }
}

/** PAD ACTION CREATORS */
/**
 * Update an integer property of a pad, value is cast to an int
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadIntProperty(padId, property, value) {
  if (value === "") {
    // dont cast empty value, let it be empty
    return updatePadProperty(padId, property, value);
  }
  return updatePadProperty(padId, property, parseInt(value, 10));
}
/**
 * Update an integer property of a pad, value is cast to a string
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadStringProperty(padId, property, value) {
  return updatePadProperty(padId, property, '' + value);
}
/**
 * Update the sensitivity property of a pad
 * @param {String} padId
 * @param {String} value
 */
export function updatePadSensitivity(padId, value) {
  return updatePadProperty(padId, "sensitivity", value);
}
/**
 * Update an individual property of a pad
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadProperty(padId, property, value) {
  return (dispatch, getState) => {
    dispatch({ type: Actions.UPDATE_PAD_PROPERTY, padId: padId, property: property, value: value });

    dispatch(validatePad(padId));
  }
}
export function validatePad(padId) {
  return (dispatch, getState) => {
    let state = getState();
    let pad = state.pads[padId];
    let prevErrors = pad.errors;
    let errors = [];

    if (pad.velocityMin > pad.velocityMax) {
      errors.push(PadErrors.VELOCITY_SWAPPED_A)
    }
    if (pad.velocityMin > 127 || pad.velocityMax > 127) {
      errors.push(PadErrors.VELOCITY_TOO_HIGH_A);
    }
    if (pad.velocityMinB > pad.velocityMaxB) {
      errors.push(PadErrors.VELOCITY_SWAPPED_B)
    }
    if (pad.velocityMinB > 127 || pad.velocityMaxB > 127) {
      errors.push(PadErrors.VELOCITY_TOO_HIGH_B);
    }

    if (prevErrors.length || errors.length) {
      dispatch({ type: Actions.UPDATE_PAD_PROPERTY, padId: padId, property: 'errors', value: errors });
    }
  }
}

/** APP ACTION CREATORS */
/**
 * set the dropdown's selected kit and set it as currently active
 * @param {String} kitId
 */
export function selectKit(kitId) {
  return (dispatch, getState) => {
    // if the kit isnt loaded, load it before activating it
    dispatch(loadKitDetails(kitId));

    // set it as the selected and active kit
    dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kitId });
    dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kitId });
  }
}

/** MODAL ACTION CREATORS */
export function confirmFileOverwrite(callback) {
  return (dispatch, getState) => {
    dispatch({ type: Actions.SHOW_MODAL_CONFIRM_OVERWRITE, callback: callback });
  }
}
export function confirmFileOverwriteAction(result) {
  return (dispatch, getState) => {
    let state = getState();
    let callback = state.modals.confirmOverwriteCallback;

    dispatch({ type: Actions.HIDE_MODAL_CONFIRM_OVERWRITE });
    dispatch(callback(result));
  }
}
export function closeFixKitErrors() {
  return (dispatch, getState) => {
    dispatch({ type: Actions.HIDE_MODAL_KIT_ERRORS });
  }
}

