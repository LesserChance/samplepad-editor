/* Global imports */
import { combineReducers } from 'redux'
import update from 'immutability-helper';

/* App imports */
import { Actions } from 'const'
import { getGlobalStateFromDirectory } from 'state/globalState';
import { getSortedKitIds } from 'state/sortModels';
import { getLastLoadedDirectory } from 'util/storage';

let lastLoadedDirectory = getLastLoadedDirectory();
let initialState = {
  modals: {
    confirmOverwriteVisible: false,
    confirmOverwriteCallback: null,
    confirmLoadCardVisible: false,
    confirmLoadCardCallback: null
  },
  notices: [],
  drive: {},
  kits: {
    ids: [],
    models: {}
  }
}

if (lastLoadedDirectory) {
  try {
    let loadState = getGlobalStateFromDirectory(lastLoadedDirectory);
    initialState.drive = loadState.drive;
    initialState.kits.ids = getSortedKitIds(loadState.kits);
    initialState.kits.models = loadState.kits;
  } catch (err) {
    // ignore failed load
  }
}

const initialModalState = initialState.modals;
const initialAppState = {
  selectedKitId: null,
  activeKitId: null
};
const initialDriveState = {
  deviceId: initialState.drive.deviceId,
  rootPath: initialState.drive.rootPath,
  kitPath: initialState.drive.kitPath,
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

function notices(state = [], action) {
  switch (action.type) {
    case Actions.SHOW_NOTICE:
      return update(state, {
        $push: [action.notice]
      });

    default:
      return state;
  }
}

function modals(state = initialModalState, action) {
  switch (action.type) {
    case Actions.SHOW_MODAL_CONFIRM_OVERWRITE:
      return update(state, {
        confirmOverwriteVisible: {$set: true},
        confirmOverwriteCallback: {$set: action.callback}
      });

    case Actions.HIDE_MODAL_CONFIRM_OVERWRITE:
      return update(state, {
        confirmOverwriteVisible: {$set: false}
      });

    case Actions.SHOW_MODAL_CONFIRM_LOAD_CARD:
      return update(state, {
        confirmLoadCardVisible: {$set: true},
        confirmLoadCardCallback: {$set: action.callback}
      });

    case Actions.HIDE_MODAL_CONFIRM_LOAD_CARD:
      return update(state, {
        confirmLoadCardVisible: {$set: false}
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
        deviceId: {$set: action.drive.deviceId},
        rootPath: {$set: action.drive.rootPath},
        kitPath: {$set: action.drive.kitPath},
        samples: {$set: action.drive.samples}
      });

    case Actions.RESET_SAMPLES:
      return update(state, {
        samples: {$set: action.samples}
      });

    default:
      return state;
  }
}

function kits(state = initialKitsState, action) {
  switch (action.type) {
    // load the list of kits into state from the SD card
    case Actions.RESET_KITS:
      return update(state, {
        ids: {$set: Object.keys(action.kits)},
        models: {$set: action.kits}
      });

    case Actions.ADD_KIT:
      return update(state, {
        ids: {$push: [action.kit.id]},
        models: {[action.kit.id]: {$set: action.kit}}
      });

    case Actions.UPDATE_KIT_PROPERTY:
      return update(state, {
        models: {
          [action.kitId]: {
            [action.property]: {$set: action.value}
          }
        }
      });

    case Actions.UPDATE_KIT_STATE:
      return update(state, {
        models: {
          [action.kitId]: {$merge: action.newState}
        }
      });

    // kits are sorted by name and isNew - if a kit would have one
    // of these properties changed, you MUST sort kits afterwards
    case Actions.SORT_KITS:
      return update(state, {
        ids: { $set: getSortedKitIds(state.models)}
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
  modals,
  notices,
  drive,
  kits,
  pads
});
