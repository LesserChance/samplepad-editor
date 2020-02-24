/* Global imports */
import { WaveFile } from 'wavefile'

/* App imports */
import { Drive } from 'const'
import { getBuffer } from 'util/buffer'
import { getKitFileBuffer } from 'util/kitFile'

/* Electron imports */
const { getFromStore, saveToStore, fs, path } = window.api

/**
 * Store the directory for next time the app opens
 * @param {String} directory
 */
export function storeLastLoadedDirectory(directory) {
  saveToStore('lastLoadedDirectory', directory);
}

/**
 * @return {String} the directory used last time the application was open
 */
export function getLastLoadedDirectory() {
  return getFromStore('lastLoadedDirectory');
}

/**
 * Copy a source sample to the sample directory
 * @param {String} source
 * @return {String} new sample file path
 * @return {String} new sample file name
 */
export function copySample(source, destinationDirectory, newFileName=false) {
  let sourcePath = path.parse(source);

  if (!newFileName) {
    newFileName = sourcePath.base;
  }

  let destination = destinationDirectory + "/" + newFileName;

  try {
    // The samples files must be 16-bit, mono or stereo .WAV files.
    // with a sample rate of 48K, 44.1K, 32K, 22.05K, and 11.025K.
    let buffer = getBuffer(source);
    let wav = new WaveFile(buffer);

    if (parseInt(wav.bitDepth, 10) !== 16) {
      wav.toBitDepth("16");
    }

    if (![48000,44100,32000,22050,11025].includes(wav.fmt.sampleRate)) {
      wav.toSampleRate(44100);
    }

    fs.writeFile(destination, wav.toBuffer());
    return destination;
  } catch (err) {
    console.error(err)
    throw(err);
  }
}

/**
 * @param {KitModel} kit
 * @param {Boolean} asNew
 * @returns {Boolean} true if the kit would clobber another
 */
export const kitWillOverwriteExisting = (kit, asNew = false) => {
  if(!fs.exists(kit.filePath)) {
    return false;
  }

  let desiredFileName = kit.kitName + Drive.KIT_EXTENSION;
  let currentFileName = kit.fileName;
  let kitFile = kit.filePath + "/" + desiredFileName;

  if (!currentFileName || currentFileName.toUpperCase() !== desiredFileName.toUpperCase()) {
    return fs.exists(kitFile);
  }

  return false;
}

/**
 * @param {KitModel} kit
 * @param {PadModel[]} pads
 * @param {Boolean} asNew
 * @returns {String} the file name the kit was stored as
 */
export const saveKitToFile = (kit, pads, asNew = false) => {
  if(!fs.exists(kit.filePath)) {
    // need to create the kits directory
    fs.mkdir(kit.filePath);
  }

  let desiredFileName = kit.kitName + Drive.KIT_EXTENSION;
  let currentFileName = kit.fileName;

  if (asNew) {
    // the kit is being stored as a new kit, drop the reference to the old file
    currentFileName = null;
  }

  let kitFile = kit.filePath + "/" + desiredFileName;
  try {
    if (currentFileName && desiredFileName !== currentFileName && !asNew) {
      // we need to rename the file first
      fs.renameFile(kit.filePath + "/" + currentFileName, kitFile);
    }

    fs.writeFile(kitFile, getKitFileBuffer(kit, pads))
  } catch (err) {
    console.error(err);
    throw(err);
  }

  return desiredFileName;
}
