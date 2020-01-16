export const DragItemTypes = {
  SAMPLE: 'sample',
};

export const Drive = {
  SAMPLE_EXTENSION: ".wav",
  KIT_EXTENSION: ".kit",
  KIT_FILE_TYPE: "kit",
  KIT_DIRECTORY: "KITS"
};

export const KitBuffer = {
  HEADER: [0x4B,0x49,0x54,0x48,0x00,0x80,0x00,0x00],
  CHECKSUM_BYTE: 0x08,

  // map setup {note: [level, tune, pan, reverb, sensitivity, mgrp, velocityMin, velocityMax, displayName, fileName], ...}

  // todo: need to store references to all layer b param locations
  NOTE_MAP: {
    36: [0x0fa9,0x0fad,0x0fb1,0x0fb5,0x0fc1,0x0fc9,0x2802,0x2803,0x2808,0x2810]
  },

  // the index in the above map which each param uses
  PROP_MAP_KEY: {
    'level': 0,
    'tune': 1,
    'pan': 2,
    'reverb': 3,
    'sensitivity': 4,
    'mgrp': 5,
    'velocityMin': 6,
    'velocityMax': 7,
    'displayName': 8,
    'fileName': 9
  },

  // Second Layer - havent figured these out yet
  // fileName_b: null,
  // displayName_b: null,
  // velocityMin_b: null,
  // velocityMax_b: null,


  // the data type for each prop
  PROP_TYPE: {
    'level': 'uint8',
    'tune': 'uint8',
    'pan': 'uint8',
    'reverb': 'uint8',
    'sensitivity': 'uint8',
    'mgrp': 'uint8',
    'velocityMin': 'uint8',
    'velocityMax': 'uint8',
    'displayName': 'string',
    'fileName': 'string'
  },

  // the number of bytes to read for a string prop
  PROP_LENGTH: {
    'displayName': 8,
    'fileName': 8
  }
};