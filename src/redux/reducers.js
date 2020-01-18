import { combineReducers } from 'redux'
import { Actions } from '../util/const'
import update from 'immutability-helper';
import { getGlobalStateFromDirectory } from "../util/fileParser";
import { getLastLoadedDirectory } from "../util/storage";

let lastLoadedDirectory = getLastLoadedDirectory();
let initialState = {
  drive: {},
  kits: {}
}

if (lastLoadedDirectory) {
  try {
    initialState = getGlobalStateFromDirectory(lastLoadedDirectory);
  } catch (err) {
    // ignore failed load
  }
}

const initialAppState = {
  selectedKitId: null,
  activeKitId: null
};
const initialDriveState = {
  rootPath: initialState.drive.rootPath,
  kitPath: initialState.drive.kitPath,
  fileCount: initialState.drive.fileCount,
  samples: initialState.drive.samples
};
const initialKitsState = initialState.kits;

function app(state = initialAppState, action) {
  switch (action.type) {
    case Actions.SET_SELECTED_KIT_ID:
      return update(state, {
        selectedKitId: {$set: action.kitId}
      });
    case Actions.SET_ACTIVE_KIT_ID:
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
    case Actions.LOAD_DRIVE:
      return update(state, {
        rootPath: {$set: action.drive.rootPath},
        kitPath: {$set: action.drive.kitPath},
        fileCount: {$set: action.drive.fileCount},
        samples: {$set: action.drive.samples}
      });

    default:
      return state;
  }
}

function kits(state = initialKitsState, action) {
  switch (action.type) {
    // load the list of kits into state from the SD card
    case Actions.ADD_KITS:
      return update(state, {$merge: action.kits});
    case Actions.ADD_KIT:
      return update(state, {
        [action.kit.id]: {$set: action.kit}
      });
    case Actions.UPDATE_KIT_PROPERTY:
      return update(state, {
        [action.kitId]: {
          [action.property]: {$set: action.value}
        }
      });
    case Actions.UPDATE_KIT_STATE:
      return update(state, {
        [action.kitId]: {$merge: action.newState}
      });
    default:
      return state;
  }
}

function pads(state = {}, action) {
  switch (action.type) {
    case Actions.ADD_PADS:
      return update(state, {$merge: action.pads});
    case Actions.ADD_PAD:
      return update(state, {
        [action.pad.id]: {$set: action.pad}
      });
    case Actions.UPDATE_PAD_PROPERTY:
      return update(state, {
        [action.padId]: {
          [action.property]: {$set: action.value}
        }
      });
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
