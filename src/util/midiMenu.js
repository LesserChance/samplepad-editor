/* Electron imports */
const { midi, mainProcessCallbacks, mainProcessTriggers } = window.api

/**
 * Initialize the renderer process handlers for the midi device menu
 */
export const initMidiMenu = () => {
  let inputList = midi.getInputList()
  mainProcessTriggers.generateMidiMenu(inputList, (inputList.length ? 0 : null))
  mainProcessCallbacks.setSelectMidiInputCallback(selectMidiMenuItem)
  mainProcessCallbacks.setSelectMidiScanCallback(scanForMidiDevices)
}

/**
 * Tell the main process to scan for midi devices, when it finds any
 * the menu will be regenerated with available devices
 */
export const scanForMidiDevices = () => {
  midi.scanForMidiDevices();
  mainProcessTriggers.generateMidiMenu(midi.getInputList(), null)
}

/**
 * A midi device has been selected from the menu, bind note handlers
 */
export const selectMidiMenuItem = (inputIndex) => {
  midi.bindMidiInput(inputIndex);
}