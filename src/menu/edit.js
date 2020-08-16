/* App imports */
import store from 'state/store'
import { selectAndLoadDrive } from 'actions/drive'

/* Electron imports */
const { mainProcessCallbacks } = window.api

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