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

export const PadModel = (midiNote = null, fileName = "", displayName = "", velocityMin = 0, velocityMax = 127, fileName_b = "", displayName_b = "", velocityMin_b = 0, velocityMax_b = 127, reverb = 0, level = 0, mode = null, mgrp = 0, tune = 0, sensitivity = 8, pan = 0) => {
  return {
    id: uuidv1(),
    midiNote: midiNote,

    // First Layer
    fileName: fileName,
    displayName: displayName,
    velocityMin: velocityMin,
    velocityMax: velocityMax,

    // Second Layer
    fileName_b: fileName_b,
    displayName_b: displayName_b,
    velocityMin_b: velocityMin_b,
    velocityMax_b: velocityMax_b,

    reverb: reverb,
    level: level,
    mode: mode,
    mgrp: mgrp,
    tune: tune,
    sensitivity: sensitivity,
    pan: pan
  };
}
