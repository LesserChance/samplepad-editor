import { Drive, KitBuffer } from "../util/const";
import { RootModel, KitModel, PadModel } from "../redux/models";

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

/**
 * Open a file dialog with appropriate file type filters for kits
 * @return {Promise}
 */
export function openKitFileDialog() {
  return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties:["openFile"],
    filters: [
      { name: 'Kits (* .' + Drive.KIT_FILE_TYPE + ')',
        extensions: [Drive.KIT_FILE_TYPE] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
}

/**
 * Open a directory dialog
 * @return {Promise}
 */
export function openDriveDirectoryDialog() {
  return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties:["openDirectory"]
  })
}

/**
 * @param {String} kitFile - the file to parse
 * @return {KitModel, PadModel[]} kit, pads
 */
export function getKitAndPadsFromFile(kitFile) {
  if(!fs.existsSync(kitFile)) {
    return null;
  }

  let kitPath = path.parse(kitFile);
  let pads = getKitPadsFromFile(kitFile);

  var kit = KitModel(
    kitPath.dir,
    kitPath.base,
    true,
    false,
    true,
    kitPath.name,
    Object.keys(pads)
  );

  return {kit, pads};
}

/**
 * @param {String} rootPath
 * @return {RootModel, KitModel[]}
 */
export const getGlobalStateFromDirectory = (rootPath) => {
  let kitPath = rootPath + "/" + Drive.KIT_DIRECTORY;
  let allFiles = fs.readdirSync(rootPath, {withFileTypes: true});

  let fileCount = allFiles
    .filter((dirent, index, arr) => {
      return dirent.isFile() && !(/(^|\/)\.[^/.]/g).test(dirent.name)
    }).length

  let sampleFiles = allFiles
    .filter((dirent, index, arr) => {
      return dirent.isFile()
        && path.extname(dirent.name).toLowerCase() === Drive.SAMPLE_EXTENSION
        && !(/(^|\/)\.[^/.]/g).test(dirent.name)
    })

  let kitFiles = fs.readdirSync(kitPath, {withFileTypes: true})
    .filter((dirent, index, arr) => {
      return dirent.isFile()
        && path.extname(dirent.name).toLowerCase() === Drive.KIT_EXTENSION
        && !(/(^|\/)\.[^/.]/g).test(dirent.name)
    })

  let kits = {};

  kitFiles.forEach((kitFile) => {
    let kit = KitModel(kitPath, kitFile.name, null, true, null, kitFile.name.slice(0, -4));
    kits[kit.id] = kit;
  });

  let drive = RootModel(rootPath, kitPath, fileCount, sampleFiles);

  return {drive, kits};
}

/**
 * @param {String} kitFile
 * @return {PadModel[]} pads
 */
export const getKitPadsFromFile = (kitFile) => {
  let pads = {};
  let buffer = fs.readFileSync(kitFile);

  let checksum = buffer.readUInt8(KitBuffer.CHECKSUM_BYTE);
  if (checksum !== calculateChecksumFromBuffer(buffer)) {
    throw new Error("Invalid .kit file")
  }

  for (let midiNote in KitBuffer.NOTE_MAP) {
    let padProps = PadModel(midiNote);

    // parse the file buffer into properties for the pad
    Object.keys(KitBuffer.PROP_MAP_KEY).forEach(function(prop) {
      padProps[prop] = (() => {
        let buffer_start = KitBuffer.NOTE_MAP[midiNote][KitBuffer.PROP_MAP_KEY[prop]];

        switch (KitBuffer.PROP_TYPE[prop]) {
          case 'uint8':
            return buffer.readUInt8(buffer_start);
          case 'string':
            return buffer.toString("utf-8", buffer_start, buffer_start + KitBuffer.PROP_LENGTH[prop]).replace(/\0/g, '').trim();
          default:
            return null;
        }
      })();
    });

    if (padProps.fileName) {
      // the file name parsed does not have the extensions
      padProps.fileName = (padProps.fileName + Drive.SAMPLE_EXTENSION);
      pads[padProps.id] = padProps;
    }
  }

  return pads;
}

/**
 * @param {KitModel} kit
 * @param {Boolean} asNew
 */
export const saveKitToFile = (kit, asNew = false) => {
  if (kit.isNew) {
    // do file stuff
    // determine the fileName
    // assure we have a file_path, or get from sd card
    // save the file

  } else {
    // do file stuff
    // determine the fileName
    // if kit.fileName different from the new determined fileName, we need to update the file's name
    // unless asNew is true, then just save the new file
    // save the file

    let kitFile = kit.filePath + "/" + kit.fileName;

    if(fs.existsSync(kitFile)) {
      fs.open(kitFile, "r+", (err, fd) => {
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
  }
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

/*
 * kit file checksum is least significant byte of the sum of all bytes after the checksum
 * @param {Buffer} buffer
 * @return {Number}
 */
const calculateChecksumFromBuffer = (buffer) => {
  return buffer
    .slice(KitBuffer.CHECKSUM_BYTE + 1)
    .reduce((a, b) => a + b) % 256;
}
