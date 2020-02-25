/* Electron imports */
const { midi } = window.api

export const initMidiMenu = () => {
  console.log(midi.getInputList());
  window.postMessage({
    type: 'setMidiMenu',
    midiInputs: midi.getInputList()
  });

  midi.bindMidiInput(0);
}

export const selectMenuItem = (inputIndex) => {
  midi.bindMidiInput(inputIndex);
}