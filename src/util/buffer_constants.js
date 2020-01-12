// these are references to all information needed to parse parameters out of a file
export default Object.freeze({
  HEADER: [0x4B,0x49,0x54,0x48,0x00,0x80,0x00,0x00],
  CHECKSUM_BYTE: 0x08,

  // map setup {note: [level, tune, pan, reverb, sensitivity, mgrp, velocity_min, velocity_max, display_name, filename], ...}

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
    'velocity_min': 6,
    'velocity_max': 7,
    'display_name': 8,
    'filename': 9
  },

  // the data type for each prop
  PROP_TYPE: {
    'level': 'uint8',
    'tune': 'uint8',
    'pan': 'uint8',
    'reverb': 'uint8',
    'sensitivity': 'uint8',
    'mgrp': 'uint8',
    'velocity_min': 'uint8',
    'velocity_max': 'uint8',
    'display_name': 'string',
    'filename': 'string'
  },

  // the number of bytes to read for a string prop
  PROP_LENGTH: {
    'display_name': 8,
    'filename': 8
  }
});