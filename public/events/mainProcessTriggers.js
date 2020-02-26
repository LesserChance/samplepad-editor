const Events = require("./events")

/**
 * This class is responsible for the main process receiving events
 * from the renderer process
 *
 * context: renderer
 */
module.exports = {
  generateMidiMenu: (inputList, currentMidiInput) => {
    window.postMessage({
      type: Events.GENERATE_MIDI_MENU,
      midiInputs: inputList,
      currentMidiInput: currentMidiInput
    })
  }
}