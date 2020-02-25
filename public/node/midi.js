const WebMidi = require('webmidi')

/* @var midi note => {handlerId => {min, max, callback},...} */
let noteOnCallbacks = {}

WebMidi.enable(function (err) {
  if (err) {
    console.error("WebMidi could not be enabled.", err);
  }

  var input = WebMidi.inputs[0];
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
});

module.exports = {
  getInputList: () => {
    return WebMidi.inputs;
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
