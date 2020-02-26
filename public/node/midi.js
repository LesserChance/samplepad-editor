const WebMidi = require('webmidi')

/* @var midi note => {handlerId => {min, max, callback},...} */
let noteOnCallbacks = {}

/** @var track if WebMidi is actively running */
let enabled = false

/** @var track the current selected midi device index */
let currentMidiInput = null

/**
 * Enable WebMidi
 */
const enable = () => {
  WebMidi.enable(function (err) {
    if (err) {
      console.error("WebMidi could not be enabled.", err);
    }

    enabled = true
  })
}

/**
 * Get a list of midi devices
 * @return {Tuple} [input index, input name]
 */
const getInputList = () => {
  return WebMidi.inputs.map((input, index) => {
    return [index, input.name]
  });
}

/**
 * Bind note on listeners for the given midi device
 */
const bindMidiInput = (inputIndex) => {
  if (!enabled) {
    return
  }

  currentMidiInput = inputIndex;

  // remove any current listeners
  for (let i = 0; i < WebMidi.inputs.length; i++) {
    WebMidi.inputs[i].removeListener();
  }

  if (inputIndex === null) {
    // no midi device selected
    return
  }

  // add midi listener to selected device
  var input = WebMidi.inputs[inputIndex];
  input.addListener('noteon', "all",
    function (e) {
      let noteOnCallbackList = noteOnCallbacks[e.note.number]
      if (noteOnCallbackList) {

        for (let handlerId of Object.keys(noteOnCallbackList)) {
          let noteOnCallback = noteOnCallbackList[handlerId]
          if (e.rawVelocity >= noteOnCallback.min && e.rawVelocity <= noteOnCallback.max) {
            noteOnCallback.callback(e);
          }
        }
      }
    }
  );
}

// Enable WebMidi as soon as called
enable()

module.exports = {
  getInputList: getInputList,
  bindMidiInput: bindMidiInput,

  /**
   * Assure WebMidi is enabled, regenerate the list of midi devices
   * regenerate the midi menu with the new inputs
   */
  scanForMidiDevices: () => {
    // deselect any current device
    bindMidiInput(null)

    // assure WebMidi is active
    enable()

    // update the menu with detected midi devices
    window.postMessage({
      type: 'setMidiMenu',
      midiInputs: getInputList(),
      currentMidiInput: currentMidiInput
    });
  },

  /**
   * Whenever the selcted midi device has a note on event, call the given callback
   * @param {String} handlerId - a unique id for this handler, necessary for destroying it
   * @param {Number} note - the midi note to listen for
   * @param {Number} min - the min velocity to detect
   * @param {Number} max - the max velocity to detect
   * @param {Function} callback
   */
  addMidiNoteOnHandler: (handlerId, note, min, max, callback) => {
    if (!noteOnCallbacks[note]){
      noteOnCallbacks[note] = {}
    }

    noteOnCallbacks[note][handlerId] = {
      min: min,
      max: max,
      callback: callback
    }
  },

  /**
   * remove midi note on handler
   * @param {String} handlerId - the unique id reference of the handler
   * @param {Number} note - the midi note being listened for
   */
  removeMidiNoteOnHandler: (handlerId, note) => {
    if (noteOnCallbacks[note] && noteOnCallbacks[note][handlerId]) {
      delete noteOnCallbacks[note][handlerId]
    }
  }
}
