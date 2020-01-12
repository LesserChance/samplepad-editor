import Kit from '../model/kit';
import Pad from '../model/pad';
import SdCard from '../model/sd_card';

import BUFFER_CONSTANTS from './buffer_constants'
import KIT_CONSTANTS from './kit_constants'

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

class KitfileParser {
  static async openKitFile() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openFile"],
      filters: [
        { name: 'Kits (*' + KIT_CONSTANTS.KIT_EXTENSION + ')',
          extensions: [KIT_CONSTANTS.KIT_EXTENSION.subtring(1)] },
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

  static async openSdCard() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openDirectory"]
    }).then(result => {
      if (result.canceled) {
        return null;
      }

      return KitfileParser.getSdCard(result.filePaths[0]);
    }).catch(err => {
      console.log(err)
    })
  }

  static async getSdCard(dirpath) {
    let files = await fs.readdirSync(dirpath, {withFileTypes: true});

    return new SdCard({
      rootpath: dirpath,
      samples: files.filter((dirent, index, arr) => {
        return dirent.isFile()
          && path.extname(dirent.name).toLowerCase() === KIT_CONSTANTS.SAMPLE_EXTENSION
          && !(/(^|\/)\.[^\/\.]/g).test(dirent.name)
      })
    });
  }

  static getKit(filename) {
    if(fs.existsSync(filename)) {
      let pads = [];
      let buffer = fs.readFileSync(filename);

      let checksum = buffer.readUInt8(BUFFER_CONSTANTS.CHECKSUM_BYTE);
      if (checksum !== KitfileParser.calculateChecksumFromBuffer(buffer)) {
        throw new Error("Invalid .kit file")
      }

      for (let midi_note in BUFFER_CONSTANTS.NOTE_MAP) {
        let pad_props = {
          midi_note: midi_note
        };

        // parse the file buffer into properties for the pad
        Object.keys(BUFFER_CONSTANTS.PROP_MAP_KEY).forEach(function(prop) {
          pad_props[prop] = (() => {
            let buffer_start = BUFFER_CONSTANTS.NOTE_MAP[midi_note][BUFFER_CONSTANTS.PROP_MAP_KEY[prop]];

            switch (BUFFER_CONSTANTS.PROP_TYPE[prop]) {
              case 'uint8':
                return buffer.readUInt8(buffer_start);
              case 'string':
                return buffer.toString("utf-8", buffer_start, buffer_start + BUFFER_CONSTANTS.PROP_LENGTH[prop]).replace(/\0/g, '').trim();
              default:
                return null;
            }
          })();
        });

        if (pad_props.filename) {
          pads.push(pad_props);
        }
      }

      return new Kit({
        is_new: false,
        filepath: path.dirname(filename),
        filename: path.parse(filename).base,
        kit_name: path.parse(filename).name,
        pads: Pad.fromArray(pads)
      });
    }

    // default: get an empty kit
    return KitfileParser.getEmptyKit();
  }

  // kit file checksum is least significant byte of the sum of all bytes after the checksum
  static calculateChecksumFromBuffer(buffer) {
    return buffer
      .slice(BUFFER_CONSTANTS.CHECKSUM_BYTE + 1)
      .reduce((a, b) => a + b) % 256;
  }

  static getEmptyKit() {
    return new Kit({
      is_new: true,
      filepath: null,
      filename: null,
      kit_name: "",
      pads: []
    });
  }

  static saveKitFile(kit, as_new) {
    console.log("save");
    console.log(kit);

    if (kit.is_new) {
      // do file stuff
      // determine the filename
      // assure we have a filepath, or get from sd card
      // save the file

    } else {
      // do file stuff
      // determine the filename
      // if kit.filename different from the new determined filename, we need to update the file's name
      // unless as_new is true, then just save the new file
      // save the file


      if(fs.existsSync(kit.getFullFilePath())) {
        fs.open(kit.getFullFilePath(), "r+", (err, fd) => {
          if (err) throw err;

          // write the kit name
          // todo

          // write the notes
          for (let midi_note in BUFFER_CONSTANTS.NOTE_MAP) {
            let pad = kit.getPadWithNote(midi_note);

            Object.keys(BUFFER_CONSTANTS.PROP_MAP_KEY).forEach(function(prop) {
              let buffer_length = BUFFER_CONSTANTS.PROP_LENGTH[prop] || 1;
              let write_buffer = Buffer.alloc(buffer_length)

              if (pad && pad[prop]) {
                  switch (BUFFER_CONSTANTS.PROP_TYPE[prop]) {
                    case 'uint8':
                      write_buffer.writeUInt8(pad[prop], 0);
                      break;
                    case 'string':
                      write_buffer.write(pad[prop]);
                      break;
                  }
              }

              let buffer_start = BUFFER_CONSTANTS.NOTE_MAP[midi_note][BUFFER_CONSTANTS.PROP_MAP_KEY[prop]];
              fs.writeSync(fd, write_buffer, 0, buffer_length, buffer_start);
            });
          }

          // write the checksum
          let buffer = fs.readFileSync(kit.getFullFilePath());
          let checksum = KitfileParser.calculateChecksumFromBuffer(buffer);
          let checksum_buffer = Buffer.from(Array(1));
          checksum_buffer.writeUInt8(checksum, 0);
          fs.writeSync(fd, checksum_buffer, 0, 1, BUFFER_CONSTANTS.CHECKSUM_BYTE);
        });
      }




    }
  }
}

export default KitfileParser;