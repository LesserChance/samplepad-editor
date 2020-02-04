/* Global imports */
import uuidv1 from 'uuid/v1';

export const NoticeModel = (style = "", text = "") => {
  return {
    id: uuidv1(),
    style: style,
    text: text
  };
}

export const RootModel = (deviceId = "", rootPath = "", kitPath = "", samples = []) => {
  return {
    deviceId: deviceId,
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
  static getPad(padType = "", location = 1, level = 10, tune = 0, pan = 0, reverb = 0, midiNote = 0, mode = 1, sensitivity = 1, mgrp = 0, velocityMin = 0, velocityMax = 127, fileName = "", velocityMinB = 0, velocityMaxB = 127, fileNameB = "") {
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
   * @returns {Number}
   */
  static getSensitivityDisplayValue(sensitivity) {
    switch (sensitivity) {
      case 0x0b:
        return 1;
      case 0x0e:
        return 2;
      case 0x11:
        return 3;
      case 0x14:
        return 4;
      case 0x17:
        return 5;
      case 0x1a:
        return 6;
      case 0x1d:
        return 7;
      case 0x20:
        return 8;
      default:
        return 1;
    }
  }

  /*
   * @param {Number} value
   */
  static getSensitivityFileValue(sensitivity) {
    switch (sensitivity) {
      case 1:
        return 0x0b;
      case 2:
        return 0x0e;
      case 3:
        return 0x11;
      case 4:
        return 0x14;
      case 5:
        return 0x17;
      case 6:
        return 0x1a;
      case 7:
        return 0x1d;
      case 8:
        return 0x20;
      default:
        return 0x00;
    }
  }

}
