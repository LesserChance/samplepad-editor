/* Electron imports */
const { midi, rendererProcessEvents } = window.api

/**
 * Initialize the renderer process handlers for the midi device menu
 */
export const initMidiMenu = () => {
  let inputList = midi.getInputList()
  window.postMessage({
    type: 'setMidiMenu',
    midiInputs: inputList,
    currentMidiInput: inputList.length ? 0 : null
  });

  rendererProcessEvents.setSelectMidiInputCallback(selectMidiMenuItem)
  rendererProcessEvents.setSelectMidiScanCallback(scanForMidiDevices)
}

/**
 * Tell the main process to scan for midi devices, when it finds any
 * the menu will be regenerated with available devices
 */
export const scanForMidiDevices = () => {
  midi.scanForMidiDevices();
}

/**
 * A midi device has been selected from the menu, bind note handlers
 */
export const selectMidiMenuItem = (inputIndex) => {
  midi.bindMidiInput(inputIndex);
}