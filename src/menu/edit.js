/* Global imports */
import React from 'react';

/* App imports */
import { Actions } from 'const';
import store from 'state/store'
import { getGlobalStateFromDirectory, writeDeviceDetailsToFile } from 'state/globalState';
import { selectAndLoadDrive } from 'actions/drive'

/* Electron imports */
const { mainProcessCallbacks, mainProcessTriggers } = window.api

/**
 * Initialize the renderer process handlers for the menu
 */
export const initEditMenu = () => {
  mainProcessCallbacks.setLoadSDCardCallback(loadSDCard)
}

/**
 * "Load SD Card" has been selected from the menu
 */
export const loadSDCard = () => {
  store.dispatch(selectAndLoadDrive());
}