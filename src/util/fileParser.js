import { Drive, KitBuffer, MidiMap } from "../util/const";
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

  Object.keys(KitBuffer.PAD_MAP).forEach(function(padType) {
    let padProps = PadModel(padType);
    let blockLocations = KitBuffer.PAD_MAP[padType];

    // read from block 1
    KitBuffer.PAD_PARAM_READ_BLOCKS.forEach(function(blockParams, blockIndex) {
      let blockStart = blockLocations[blockIndex];

      blockParams.forEach(function(blockParam) {
        let paramLocation = KitBuffer.PAD_PARAM_START_MAP[blockParam];
        let bufferStart = blockStart + paramLocation;
        padProps[blockParam] = buffer.readUInt8(bufferStart);
      });
    });

    if (padProps.fileNameLength) {
      //read the filename from block 4
      let fileNameBufferStart = blockLocations[3] + KitBuffer.PAD_PARAM_START_MAP.fileName;
      padProps.fileName = buffer.toString("utf-8", fileNameBufferStart, fileNameBufferStart + padProps.fileNameLength) + Drive.SAMPLE_EXTENSION;

      // read the display name from block 4
      let displayNameBufferStart = blockLocations[3] + KitBuffer.PAD_PARAM_START_MAP.displayName;
      padProps.displayName = buffer.toString("utf-8", displayNameBufferStart, displayNameBufferStart + padProps.fileNameLength);
    }

    if (padProps.fileNameLengthB) {
      //read the filename from block 4
      let fileNameBufferStartB = blockLocations[3] + KitBuffer.PAD_PARAM_START_MAP.fileNameB;
      padProps.fileNameB = buffer.toString("utf-8", fileNameBufferStartB, fileNameBufferStartB + padProps.fileNameLengthB) + Drive.SAMPLE_EXTENSION;

      // read the display name from block 4
      let displayNameBufferStartB = blockLocations[3] + KitBuffer.PAD_PARAM_START_MAP.displayNameB;
      padProps.displayNameB = buffer.toString("utf-8", displayNameBufferStartB, displayNameBufferStartB + padProps.fileNameLengthB);
    }

    pads[padProps.padType] = padProps;
  });

  //sort the pads by pad type and insert any missing ones
  let sortedPads = [];
  Object.keys(MidiMap).forEach(function(padType) {
    let pad = pads[padType];

    if (!pad) {
      // if for some reason the pad doesnt exist, create a blank one
      pad = PadModel(padType);
    }

    sortedPads[pad.id] = pad;
  });

  return sortedPads;
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
