import { KitModel } from "../util/models";
import { getGlobalStateFromDirectory, getKitAndPadsFromFile, openKitFileDialog} from "../util/fileParser";

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

/* drive action types */
export const LOAD_DRIVE = 'LOAD_DRIVE'

/* kit action types */
export const ADD_KITS = 'ADD_KITS'
export const ADD_KIT = 'ADD_KIT'
export const UPDATE_KIT_PROPERTY = 'UPDATE_KIT_PROPERTY'
export const UPDATE_KIT_STATE = 'UPDATE_KIT_STATE'

/* pad action types */
export const ADD_PADS = 'ADD_PADS'
export const ADD_PAD = 'ADD_PAD'
export const UPDATE_PAD_PROPERTY = 'UPDATE_PAD_PROPERTY'

/* app action types */
export const SET_SELECTED_KIT_ID = 'SET_SELECTED_KIT_ID'
export const SET_ACTIVE_KIT_ID = 'SET_ACTIVE_KIT_ID'

/* drive action creators */
export function loadDrive() {
  return (dispatch) => {
      let {drive, kits} = getGlobalStateFromDirectory('/Volumes/SAMPLERACK');
      dispatch({ type: LOAD_DRIVE, drive: drive });
      dispatch({ type: ADD_KITS, kits: kits });
  }
}

/* kit action creators */
export function importKitFromFile(result) {
  return (dispatch) => {
    openKitFileDialog()
      .then(result => {
        if (result.canceled) {
          return null;
        }

        let {kit, pads} = getKitAndPadsFromFile(result.filePaths[0]);
        dispatch({ type: ADD_PADS, pads: pads });
        dispatch({ type: ADD_KIT, kit: kit });
        dispatch({ type: SET_SELECTED_KIT_ID, kitId: kit.id });
        dispatch({ type: SET_ACTIVE_KIT_ID, kitId: kit.id });
      })
  }
}
export function loadKitDetails(kitId) {

}
export function loadNewKit() {
  return (dispatch) => {
    var kit = KitModel(null, null, true, false, true);
    dispatch({ type: ADD_KIT, kit: kit });
    dispatch({ type: SET_SELECTED_KIT_ID, kitId: kit.id });
    dispatch({ type: SET_ACTIVE_KIT_ID, kitId: kit.id });
  }
}
export function saveKit(kitId) {

}
export function saveNewKit(kitId) {

}
export function updateKitProperty(kitId, property, value) {
  return { type: UPDATE_KIT_PROPERTY, kitId: kitId, property: property, value: value }
}
export function updateKitState(kitId, newState) {
  return { type: UPDATE_KIT_STATE, kitId: kitId, newState: newState }
}

/* pad action creators */
export function updatePadSample(padId, value) {

}
export function updatePadIntProperty(padId, property, value) {
  return updatePadProperty(padId, property, parseInt(value, 10));
}
export function updatePadStringProperty(padId, property, value) {
  return updatePadProperty(padId, property, '' + value);
}
export function updatePadSensitivity(padId, value) {
  return updatePadProperty(padId, "sensitivity", value);
}
export function updatePadProperty(padId, property, value) {
  return { type: UPDATE_PAD_PROPERTY, padId: padId, property: property, value: value }
}

/* app action types */
export function selectKit(kitId) {
  return (dispatch, getState) => {
    let state = getState();
    let selectedKit = state.kits[kitId];

    // if the kit isnt loaded, load it before activating it
    if (!selectedKit.isLoaded) {
      let kitFile = selectedKit.filePath + "/" + selectedKit.fileName;
      if(fs.existsSync(kitFile)) {
        let {kit, pads} = getKitAndPadsFromFile(kitFile);

        dispatch({ type: ADD_PADS, pads: pads });
        dispatch(updateKitState(kitId, {
          "isLoaded": true,
          "kitName": kit.kitName,
          "pads": kit.pads
        }));
      }
    }

    dispatch({ type: SET_SELECTED_KIT_ID, kitId: kitId });
    dispatch({ type: SET_ACTIVE_KIT_ID, kitId: kitId });
  }
}
