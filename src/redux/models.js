const uuidv1 = require('uuid/v1');

export const RootModel = (rootPath = "", kitPath = "", samples = []) => {
  return {
    rootPath: rootPath,
    kitPath: kitPath,
    samples: samples
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
    pads: pads
  };
}

export const PadModel = (padType = "", location = "", level = 0, tune = 0, pan = 0, reverb = 0, midiNote = 0, mode = 0, sensitivity = 0, mgrp = 0, velocityMin = 0, velocityMax = 1, fileNameLength = 0, displayName = "", fileName = "", velocityMinB = 0, velocityMaxB = 1, fileNameLengthB = 0, displayNameB = "", fileNameB = "") => {
  return {
    id: uuidv1(),
    padType: padType,
    location: location,

    // blocks 2 and 3
    level: level,
    tune: tune,
    pan: pan,
    reverb: reverb,
    midiNote: midiNote,
    mode: mode,
    sensitivity: sensitivity,
    mgrp: mgrp,

    // block 4
    velocityMin: velocityMin,
    velocityMax: velocityMax,
    fileNameLength: fileNameLength,
    displayName: displayName,
    fileName: fileName,
    velocityMinB: velocityMinB,
    velocityMaxB: velocityMaxB,
    fileNameLengthB: fileNameLengthB,
    displayNameB: displayNameB,
    fileNameB: fileNameB
  };
}
