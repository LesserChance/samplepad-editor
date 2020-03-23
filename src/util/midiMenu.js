/* Electron imports */
const { midi, mainProcessCallbacks, mainProcessTriggers } = window.api

/**
 * Initialize the renderer process handlers for the midi device menu
 */
export const initMidiMenu = () => {
  midi.enable()

  let inputList = midi.getInputList()
  mainProcessTriggers.generateMidiMenu(inputList, (inputList.length ? 0 : null))
  mainProcessCallbacks.setSelectMidiInputCallback(selectMidiMenuItem)
  mainProcessCallbacks.setSelectMidiScanCallback(scanForMidiDevices)

  if (inputList.length) {
    selectMidiMenuItem(0)
  }
}

/**
 * Tell the main process to scan for midi devices, when it finds any
 * the menu will be regenerated with available devices
 */
export const scanForMidiDevices = () => {
  midi.scanForMidiDevices();

  let inputList = midi.getInputList()
  mainProcessTriggers.generateMidiMenu(inputList, (inputList.length ? 0 : null))

  if (inputList.length) {
    selectMidiMenuItem(0)
  }
}

/**
 * A midi device has been selected from the menu, bind note handlers
 */
export const selectMidiMenuItem = (inputIndex) => {
  midi.bindMidiInput(inputIndex);
}