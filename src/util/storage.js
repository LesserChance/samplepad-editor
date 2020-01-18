import { Drive, KitBuffer } from "../util/const";
import { calculateChecksumFromBuffer } from "../util/fileParser";

const fs = window.require('fs');
const path = window.require('path');
const Store = window.require('electron-store');

const store = new Store();

/**
 * Store the directory for next time the app opens
 * @param {String} directory
 */
export function storeLastLoadedDirectory(directory) {
  store.set('lastLoadedDirectory', directory);
}

/**
 * @return {String} the directory used last time the application was open
 */
export function getLastLoadedDirectory() {
  return store.get('lastLoadedDirectory');
}


/**
 * Copy a source sample to the sample directory
 * @param {String} source
 * @return {String} new sample file path
 */
export function copySample(source, destinationDirectory) {
  let sourcePath = path.parse(source);
  let destination = destinationDirectory + "/" + sourcePath.base;

  if(fs.existsSync(destination)) {
    // for now, dont overwrite files
    return;
  }

  try {
    fs.copyFileSync(source, destination);
    return sourcePath.base;
  } catch (err) {
    console.error(err)
    return;
  }
}

/**
 * @param {KitModel} kit
 * @param {Boolean} asNew
 * @returns {String} the file name the kit was stored as
 */
export const saveKitToFile = (kit, asNew = false) => {
  if(!fs.existsSync(kit.filePath)) {
    // need to create the kits directory
    fs.mkdirSync(kit.filePath);
  }

  let fileName = kit.fileName;

  // if the kit hasnt been stored, or we want to store it as a new kit, use the kit name as the file name
  if (!fileName || asNew) {
    fileName = kit.kitName + Drive.KIT_EXTENSION;
  }

  let kitFile = kit.filePath + "/" + fileName;

  if(!fs.existsSync(kitFile)) {
    fs.open(kitFile, "w", (err, fd) => {
      if (err) throw err;

      // write the kit name
      // todo

      // write the notes
      for (let midiNote in KitBuffer.NOTE_MAP) {
        let pad = getPadWithNote(kit, midiNote);

        Object.keys(KitBuffer.PROP_MAP_KEY).forEach(function(prop) {
          let buffer_length = KitBuffer.PROP_LENGTH[prop] || 1;
          let write_buffer = Buffer.alloc(buffer_length)

          if (pad && pad[prop]) {
              switch (KitBuffer.PROP_TYPE[prop]) {
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

          let buffer_start = KitBuffer.NOTE_MAP[midiNote][KitBuffer.PROP_MAP_KEY[prop]];
          fs.writeSync(fd, write_buffer, 0, buffer_length, buffer_start);
        });
      }

      // write the checksum
      let buffer = fs.readFileSync(kitFile);
      let checksum = calculateChecksumFromBuffer(buffer);
      let checksum_buffer = Buffer.from(Array(1));
      checksum_buffer.writeUInt8(checksum, 0);
      fs.writeSync(fd, checksum_buffer, 0, 1, KitBuffer.CHECKSUM_BYTE);
    });
  }

  return fileName;
}

/*
 * @returns {PadModel|null}
 */
const getPadWithNote = (kit, midiNote) => {
  let padWithNote = null
  Object.keys(kit.pads).forEach(function(padId) {
    let pad = kit.pads[padId];
    if (pad.midiNote === midiNote) {
      padWithNote = pad;
    }
  })

  return padWithNote;
}

