import { combineReducers } from 'redux'
import { LOAD_DRIVE,ADD_KITS,ADD_KIT,UPDATE_KIT_PROPERTY,UPDATE_KIT_STATE,ADD_PADS,ADD_PAD,UPDATE_PAD_SAMPLE,UPDATE_PAD_PROPERTY,SET_SELECTED_KIT_ID,SET_ACTIVE_KIT_ID } from './actions'
import update from 'immutability-helper';
import { KitModel } from "../util/models";
import { getKitPadsFromFile } from "../util/fileParser";

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

const initialAppState = {
  selectedKitId: null,
  activeKitId: null
};
const initialDriveState = {
  rootModelPath: null,
  kitPath: null,
  fileCount: null,
  samples: []
};

function app(state = initialAppState, action) {
  switch (action.type) {
    case SET_SELECTED_KIT_ID:
      return update(state, {
        selectedKitId: {$set: action.kitId}
      });
    case SET_ACTIVE_KIT_ID:
      return update(state, {
        activeKitId: {$set: action.kitId}
      });
    default:
      return state;
  }
}

function drive(state = initialDriveState, action) {
  switch (action.type) {
    // load data into state from the SD card
    case LOAD_DRIVE:
      return update(state, {
        rootModelPath: {$set: action.drive.driveRootModelPath},
        kitPath: {$set: action.drive.driveKitPath},
        fileCount: {$set: action.drive.driveFileCount},
        samples: {$set: action.drive.samples}
      });

    default:
      return state;
  }
}

function kits(state = {}, action) {
  switch (action.type) {
    // load the list of kits into state from the SD card
    case ADD_KITS:
      return update(state, {$merge: action.kits});
    case ADD_KIT:
      return update(state, {
        [action.kit.id]: {$set: action.kit}
      });
    case UPDATE_KIT_PROPERTY:
      return update(state, {
        [action.kitId]: {
          [action.property]: {$set: action.value}
        }
      });
    case UPDATE_KIT_STATE:
      return update(state, {
        [action.kitId]: {$merge: action.newState}
      });
    default:
      return state;
  }
}

function pads(state = {}, action) {
  switch (action.type) {
    case ADD_PADS:
      return update(state, {$merge: action.pads});
    case ADD_PAD:
      return update(state, {
        [action.pad.id]: {$set: action.pad}
      });
    case UPDATE_PAD_PROPERTY:
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  app,
  drive,
  kits,
  pads
});
