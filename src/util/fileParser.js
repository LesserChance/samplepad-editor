import { Drive, KitBuffer } from "../util/const";
import { RootModel, KitModel, PadModel } from "../redux/models";

const fs = window.require('fs');
const path = window.require('path');

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
  if(!fs.existsSync(rootPath)) {
    throw new Error("Invalid directory")
  }

  let sampleFiles = fs.readdirSync(rootPath, {withFileTypes: true})
    .filter((dirent, index, arr) => {
      return dirent.isFile()
        && path.extname(dirent.name).toLowerCase() === Drive.SAMPLE_EXTENSION
        && !(/(^|\/)\.[^/.]/g).test(dirent.name)
    })
    .map((dirent) => {
      return dirent.name
    });

  let kits = {};
  let kitPath = rootPath + "/" + Drive.KIT_DIRECTORY;

  if(fs.existsSync(kitPath)) {
    let kitFiles = fs.readdirSync(kitPath, {withFileTypes: true})
      .filter((dirent, index, arr) => {
        return dirent.isFile()
          && path.extname(dirent.name).toLowerCase() === Drive.KIT_EXTENSION
          && !(/(^|\/)\.[^/.]/g).test(dirent.name)
      })

    kitFiles.forEach((kitFile) => {
      let kit = KitModel(kitPath, kitFile.name, null, true, null, kitFile.name.slice(0, -4));
      kits[kit.id] = kit;
    });
  }

  let drive = RootModel(rootPath, kitPath, sampleFiles);

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

/*
 * kit file checksum is least significant byte of the sum of all bytes after the checksum
 * @param {Buffer} buffer
 * @return {Number}
 */
export const calculateChecksumFromBuffer = (buffer) => {
  return buffer
    .slice(KitBuffer.CHECKSUM_BYTE + 1)
    .reduce((a, b) => a + b) % 256;
}
