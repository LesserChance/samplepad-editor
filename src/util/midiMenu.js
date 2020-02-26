/* Electron imports */
const { midi, rendererProcessEvents } = window.api

export const initMidiMenu = () => {
  window.postMessage({
    type: 'setMidiMenu',
    midiInputs: midi.getInputList()
  });

  rendererProcessEvents.setSelectMidiInputCallback(selectMidiMenuItem)
}

export const selectMidiMenuItem = (inputIndex) => {
  midi.bindMidiInput(inputIndex);
}