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

export const PadModel = (padType = "", location = "", level = 0, tune = 0, pan = 0, reverb = 0, midiNote = 0, mode = 0, sensitivity = 1, mgrp = 0, velocityMin = 0, velocityMax = 127, fileName = "", velocityMinB = 0, velocityMaxB = 127, fileNameB = "") => {
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
    fileNameB: fileNameB
  };
}
