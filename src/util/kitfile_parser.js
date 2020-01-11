import Kit from '../model/kit';
import Pad from '../model/pad';

import BUFFER_CONSTANTS from './buffer_constants'

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

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
    if(fs.existsSync(filename)) {
        let pads = [];
        let data_buffer = fs.readFileSync(filename);

        // todo: confirm this conforms to kit file standards before proceeding

        for (let midi_note in BUFFER_CONSTANTS.NOTE_MAP) {
          let pad_props = {
            midi_note: midi_note
          };

          // parse the file buffer into properties for the pad
          Object.keys(BUFFER_CONSTANTS.PROP_MAP_KEY).forEach(function(prop) {
            pad_props[prop] = (() => {
              let buffer_start = BUFFER_CONSTANTS.NOTE_MAP[midi_note][BUFFER_CONSTANTS.PROP_MAP_KEY[prop]];

              switch (BUFFER_CONSTANTS.PROP_TYPE[prop]) {
                case 'int8':
                  return data_buffer.readInt8(buffer_start);
                case 'string':
                  return data_buffer.toString("utf-8", buffer_start, buffer_start + BUFFER_CONSTANTS.PROP_LENGTH[prop]);
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
    return KitfileParser.getEmptyKit();
  }

  static getEmptyKit() {
    return new Kit({
      filepath: null,
      filename: null,
      kit_name: "",
      pads: []
    });
  }
}

export default KitfileParser;