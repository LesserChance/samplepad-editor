const WebMidi = require('webmidi')

/* @var midi note => {handlerId => {min, max, callback},...} */
let noteOnCallbacks = {}
let enabled = false

const enable = () => {
  WebMidi.enable(function (err) {
    if (err) {
      console.error("WebMidi could not be enabled.", err);
    }

    enabled = true
  })
}

enable()

module.exports = {
  getInputList: () => {
    if (!enabled) {
      return
    }

    return WebMidi.inputs.map((input, index) => {
      return [index, input.name]
    });
  },
  bindMidiInput: (inputIndex) => {
    if (!enabled) {
      return
    }

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
  },
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

  removeMidiNoteOnHandler: (handlerId, note) => {
    if (noteOnCallbacks[note] && noteOnCallbacks[note][handlerId]) {
      delete noteOnCallbacks[note][handlerId]
    }
  }
}
