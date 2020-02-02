/* Global imports */
import uuidv1 from 'uuid/v1';

export const NoticeModel = (style = "", text = "") => {
  return {
    id: uuidv1(),
    style: style,
    text: text
  };
}

export const RootModel = (rootPath = "", kitPath = "", samples = []) => {
  return {
    rootPath: rootPath,
    kitPath: kitPath,
    samples: samples
  };
}

export const Sample = (fileName = "", fileNameOnDisk = "") => {
  return {
    fileName: fileName,
    fileNameOnDisk: fileNameOnDisk
  };
}

export const KitModel = (filePath = "", fileName = "", isNew = false, isExisting = false, isLoaded = false, kitName = "", pads = []) => {
  return {
    id: uuidv1(),
    isNew: isNew,
    isExisting: isExisting,
    isLoaded: isLoaded,
    filePath: filePath,
    fileName: fileName,
    kitName: kitName,
    originalKitName: kitName,
    pads: pads,
    errors: []
  };
}

export class PadModel {
  static getPad(padType = "", location = 1, level = 0, tune = 0, pan = 0, reverb = 0, midiNote = 0, mode = 0, sensitivity = 1, mgrp = 0, velocityMin = 0, velocityMax = 127, fileName = "", velocityMinB = 0, velocityMaxB = 127, fileNameB = "") {
    return {
      id: uuidv1(),
      padType: padType,
      location: location,
      level: level,
      tune: tune,
      pan: pan,
      reverb: reverb,
      midiNote: midiNote,
      mode: mode,
      sensitivity: sensitivity,
      mgrp: mgrp,
      velocityMin: velocityMin,
      velocityMax: velocityMax,
      fileName: fileName,
      velocityMinB: velocityMinB,
      velocityMaxB: velocityMaxB,
      fileNameB: fileNameB,
      errors: []
    };
  }

  /**
   * Map file values to display values
   */
  static fromFile(padType = "", location = "", level = 0, tune = 0, pan = 0, reverb = 0, midiNote = 0, mode = 0, sensitivity = 1, mgrp = 0, velocityMin = 0, velocityMax = 127, fileName = "", velocityMinB = 0, velocityMaxB = 127, fileNameB = "") {
    return this.getPad(
      padType,
      location,
      level,
      this.getUIntDisplayValue(tune),
      this.getUIntDisplayValue(pan),
      reverb,
      midiNote,
      mode,
      this.getSensitivityDisplayValue(sensitivity),
      mgrp,
      velocityMin,
      velocityMax,
      fileName,
      velocityMinB,
      velocityMaxB,
      fileNameB
    );
  }

  /*
   * used for values: -4 to +4 (unsigned int: 252,253,254,255,0,1,2,3,4)
   * @returns {Number}
   */
  static getUIntDisplayValue(value) {
    // todo: theres definitely a better way to convert uint8 to signed int here, right?
    if (value >= 252) {
      return (-1 * (256 - value));
    }

    return value;
  }

  /*
   * @param {Number} value
   */
  static getUIntFileValue(value) {
    let uint = parseInt(value, 10);

    if (uint < 0) {
      return (256 + uint);
    } else {
      return (uint);
    }
  }

  /*
   * sensitivity display is 1 to 8
   * on file 20-27
   * @returns {Number}
   */
  static getSensitivityDisplayValue(sensitivity) {
    return sensitivity - 19;
  }

  /*
   * @param {Number} value
   */
  static getSensitivityFileValue(sensitivity) {
    return sensitivity + 19;
  }

}
