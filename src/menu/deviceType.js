/* Global imports */
import React from 'react';

/* App imports */
import { Actions } from 'const';
import store from 'state/store'
import { getGlobalStateFromDirectory, writeDeviceDetailsToFile } from 'state/globalState';

/* Electron imports */
const { mainProcessCallbacks, mainProcessTriggers } = window.api

/**
 * Initialize the renderer process handlers for the device type menu
 */
export const initDeviceTypeMenu = () => {
  mainProcessCallbacks.setSelectDeviceTypeCallback(selectDeviceTypeItem)
}

/**
 * Tell the main process to select a new device type
 */
export const resetDeviceType = (deviceType) => {
  mainProcessTriggers.setDeviceType(deviceType)
}

/**
 * A SamplePad device type has been selected from the menu, update the root model
 */
export const selectDeviceTypeItem = (deviceType) => {
  // todo: should show a warning before doing this, since you could lose unsaved data
  let state = store.getState();

  // if we already have a loaded drive, we need to reset state to handle it
  if (state.drive.deviceId) {
    // reset app selections to beginning state
    store.dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: null });
    store.dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: null });

    // change the drive device type
    store.dispatch({ type: Actions.SET_DEVICE_TYPE, deviceType: deviceType });

    // save the new device details
    writeDeviceDetailsToFile(state.drive.rootPath, state.drive.deviceId, deviceType)

    // re-load the drive kits, reading in the new set of pads
    let {drive, kits} = getGlobalStateFromDirectory(state.drive.rootPath);
    store.dispatch({ type: Actions.RESET_KITS, kits: kits });
    store.dispatch({ type: Actions.SORT_KITS });
  } else {
    // change the drive device type
    store.dispatch({ type: Actions.SET_DEVICE_TYPE, deviceType: deviceType });
  }
}
