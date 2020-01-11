import Kit from '../model/kit';
import Pad from '../model/pad';

const remote = window.require('electron').remote;
var fs = window.require('fs');
var path = window.require('path');

// This is the map of each pad note and the memory locations for its parameters
const BUFFER_NOTE_MAP = {
  36: [0x00000fa9,0x00000fad,0x00000fb1,0x00000fb5,0x00000fc1,0x00000fc9,0x00002802,0x00002803,0x00002808,0x00002810]
};

// below are references to all information needed to parse parameters out of a file, keted by param name
// map setup {note: [level, tune, pan, reverb, sensitivity, mgrp, velocity_min, velocity_max, display_name, filename], ...}
const BUFFER_MAP_KEY = {
  'level': 0, 'tune': 1, 'pan': 2, 'reverb': 3, 'sensitivity': 4, 'mgrp': 5,
  'velocity_min': 6, 'velocity_max': 7, 'display_name': 8, 'filename': 9
};
const BUFFER_MAP_TYPE = {
  'level': 'int', 'tune': 'int', 'pan': 'int', 'reverb': 'int', 'sensitivity': 'int', 'mgrp': 'int',
  'velocity_min': 'int', 'velocity_max': 'int', 'display_name': 'string', 'filename': 'string'
};
const BUFFER_LENGTH = {
  'level': 1, 'tune': 1, 'pan': 1, 'reverb': 1, 'sensitivity': 1, 'mgrp': 1,
  'velocity_min': 1, 'velocity_max': 1, 'display_name': 8, 'filename': 8
}


class KitfileParser {
  static async openKitFile() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openFile"],
      filters: [
        { name: 'Kits (*.kit)', extensions: ['kit'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result => {
      if (result.canceled) {
        return null;
      }

      return KitfileParser.getKit(result.filePaths[0]);
    }).catch(err => {
      console.log(err)
    })
  }

  static getKit(filename) {
    var pads = [];

    if(fs.existsSync(filename)) {
        let data_buffer = fs.readFileSync(filename);

        for (let midi_note in BUFFER_NOTE_MAP) {
          let pad_props = {
            midi_note: midi_note
          };

          // parse the file buffer into properties for the pad
          Object.keys(BUFFER_MAP_KEY).forEach(function(prop) {
            pad_props[prop] = (() => {
              let buffer_start = BUFFER_NOTE_MAP[midi_note][BUFFER_MAP_KEY[prop]];
              let buffer_length = BUFFER_LENGTH[prop];
              let prop_buffer = data_buffer.slice(buffer_start, buffer_start + buffer_length);

              switch (BUFFER_MAP_TYPE[prop]) {
                case 'int':
                  switch (buffer_length) {
                    case 1:
                      return prop_buffer.readInt8();
                    case 2:
                      return prop_buffer.readInt16LE();
                    case 4:
                      return prop_buffer.readInt32LE();
                    default:
                      return null;
                  }
                case 'string':
                  return prop_buffer.toString("utf-8");
                default:
                  return null;
              }
            })();
          });

          pads.push(pad_props);
        }

      return new Kit({
        filepath: path.dirname(filename),
        filename: path.parse(filename).base,
        kit_name: path.parse(filename).name,
        pads: Pad.fromArray(pads)
      });
    }

    // default: get an empty kit
    return new Kit({
      filename: null,
      kit_name: "",
      pads: []
    });
  }
}

export default KitfileParser;