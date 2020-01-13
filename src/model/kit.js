import Pad from './pad';

import BUFFER_CONSTANTS from '../util/buffer_constants'
import KIT_CONSTANTS from '../util/kit_constants'

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');
const uuidv1 = require('uuid/v1');

class Kit {
  static defaultState() {
    return {
      id: uuidv1(),
      isLoaded : false,
      isNew: false,
      pads: [],
    };
  }

  constructor(props) {
    props = Object.assign({}, Kit.defaultState(), props)

    this.id = props.id;
    this.isLoaded = props.isLoaded;
    this.isNew = props.isNew;
    this.filePath = props.filePath;
    this.fileName = props.fileName;
    this.kitName = props.kitName;
    this.pads = props.pads;
  }

  /*
   * @returns {String}
   */
  getFullFilePath() {
    return this.filePath + "/" + this.fileName;
  }

  /*
   * @returns {Pad|null}
   */
  getPadWithNote(midiNote) {
    let filtered_pads = this.pads.filter((pad, index) => {
      return pad.midiNote === midiNote;
    });

    if (filtered_pads.length) {
      return filtered_pads[0];
    }

    return null;
  }

  load() {
      let props = Kit.propertiesFromFile(this.getFullFilePath());

      this.kitName = props.kitName;
      this.pads = props.pads;
      this.isLoaded = true;
  }

  save(as_new = false) {
    console.log("save");
    console.log(this);

    if (this.isNew) {
      // do file stuff
      // determine the fileName
      // assure we have a file_path, or get from sd card
      // save the file

    } else {
      // do file stuff
      // determine the fileName
      // if kit.fileName different from the new determined fileName, we need to update the file's name
      // unless as_new is true, then just save the new file
      // save the file


      if(fs.existsSync(this.getFullFilePath())) {
        fs.open(this.getFullFilePath(), "r+", (err, fd) => {
          if (err) throw err;

          // write the kit name
          // todo

          // write the notes
          for (let midiNote in BUFFER_CONSTANTS.NOTE_MAP) {
            let pad = this.getPadWithNote(midiNote);

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
                    default:
                      break;
                  }
              }

              let buffer_start = BUFFER_CONSTANTS.NOTE_MAP[midiNote][BUFFER_CONSTANTS.PROP_MAP_KEY[prop]];
              fs.writeSync(fd, write_buffer, 0, buffer_length, buffer_start);
            });
          }

          // write the checksum
          let buffer = fs.readFileSync(this.getFullFilePath());
          let checksum = Kit.calculateChecksumFromBuffer(buffer);
          let checksum_buffer = Buffer.from(Array(1));
          checksum_buffer.writeUInt8(checksum, 0);
          fs.writeSync(fd, checksum_buffer, 0, 1, BUFFER_CONSTANTS.CHECKSUM_BYTE);
        });
      }
    }
  }

  /*
   * Create Kit Models given an array of json properties
   * @param {Object[]} kit_props
   * @returns {Kit[]}
   */
  static fromArray(kit_props) {
    var kits = kit_props.map((props) => {
      // pads should reference the models
      props.pads = Pad.fromArray(props.pads);

      return new Kit(props);
    });

    return kits.sort((a, b) => {return a.kitName > b.kitName})
  }

  /*
   * Open a dialog to locate a kit file
   * @returns {Kit|null}
   */
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

      return new Kit(Kit.propertiesFromFile(result.filePaths[0]));
    }).catch(err => {
      console.log(err)
    })
  }

  /*
   * Create a Kit given a kit file
   * @param {String} fileName
   * @returns {Object} kit properties
   */
  static propertiesFromFile(fileName) {
    if(fs.existsSync(fileName)) {
      let pads = [];
      let buffer = fs.readFileSync(fileName);

      let checksum = buffer.readUInt8(BUFFER_CONSTANTS.CHECKSUM_BYTE);
      if (checksum !== Kit.calculateChecksumFromBuffer(buffer)) {
        throw new Error("Invalid .kit file")
      }

      for (let midiNote in BUFFER_CONSTANTS.NOTE_MAP) {
        let pad_props = {
          midiNote: midiNote
        };

        // parse the file buffer into properties for the pad
        Object.keys(BUFFER_CONSTANTS.PROP_MAP_KEY).forEach(function(prop) {
          pad_props[prop] = (() => {
            let buffer_start = BUFFER_CONSTANTS.NOTE_MAP[midiNote][BUFFER_CONSTANTS.PROP_MAP_KEY[prop]];

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

        if (pad_props.fileName) {
          pads.push(pad_props);
        }
      }

      return {
        kitName: path.parse(fileName).name,
        pads: Pad.fromArray(pads)
      };
    }

    // default: get an empty kit
    return {};
  }

  /*
   * kit file checksum is least significant byte of the sum of all bytes after the checksum
   * @param {Buffer} buffer
   * @return {Number}
   */
  static calculateChecksumFromBuffer(buffer) {
    return buffer
      .slice(BUFFER_CONSTANTS.CHECKSUM_BYTE + 1)
      .reduce((a, b) => a + b) % 256;
  }

  /*
   * Get a default empty kit
   * @returns {Kit}
   */
  static getEmptyKit() {
    return new Kit({
      isNew: true,
      isLoaded: true,
      filePath: null,
      fileName: null,
      kitName: "",
      pads: []
    });
  }

  /*
   * Get an unloaded empty kit (we have the file name, but havent read it)
   * @returns {Kit}
   */
  static getUnloadedKit(filePath, fileName) {
    return new Kit({
      isNew: false,
      filePath: filePath,
      fileName: fileName,
      kitName: "",
      pads: []
    });
  }
}

export default Kit;