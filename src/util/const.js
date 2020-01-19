export const Actions = {
  /* drive action types */
  LOAD_DRIVE: 'LOAD_DRIVE',
  ADD_SAMPLES: 'ADD_SAMPLES',

  /* kit action types */
  SORT_KITS: 'SORT_KITS',
  ADD_KITS: 'ADD_KITS',
  ADD_KIT: 'ADD_KIT',
  UPDATE_KIT_PROPERTY: 'UPDATE_KIT_PROPERTY',
  UPDATE_KIT_STATE: 'UPDATE_KIT_STATE',

  /* pad action types */
  ADD_PADS: 'ADD_PADS',
  ADD_PAD: 'ADD_PAD',
  UPDATE_PAD_PROPERTY: 'UPDATE_PAD_PROPERTY',

  /* app action types */
  SET_SELECTED_KIT_ID: 'SET_SELECTED_KIT_ID',
  SET_ACTIVE_KIT_ID: 'SET_ACTIVE_KIT_ID',
};

export const DragItemTypes = {
  SAMPLE: 'sample'
};

export const Drive = {
  SAMPLE_FILE_TYPE: "wav",
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

export const MidiMap = {
  35: "Bass Drum 2",
  36: "Bass Drum 1",
  37: "Side Stick",
  38: "Snare Drum 1",
  39: "Hand Clap",
  40: "Snare Drum 2",
  41: "Low Tom 2",
  42: "Closed Hi-hat",
  43: "Low Tom 1",
  44: "Pedal Hi-hat",
  45: "Mid Tom 2",
  46: "Open Hi-hat",
  47: "Mid Tom 1",
  48: "High Tom 2",
  49: "Crash Cymbal 1",
  50: "High Tom 1",
  51: "Ride Cymbal 1",
  52: "Chinese Cymbal",
  53: "Ride Bell",
  54: "Tambourine",
  55: "Splash Cymbal",
  56: "Cowbell",
  57: "Crash Cymbal 2",
  58: "Vibra Slap",
  59: "Ride Cymbal 2",
  60: "High Bongo",
  61: "Low Bongo",
  62: "Mute High Conga",
  63: "Open High Conga",
  64: "Low Conga",
  65: "High Timbale",
  66: "Low Timbale",
  67: "High Agogo",
  68: "Low Agogo",
  69: "Cabasa",
  70: "Maracas",
  71: "Short Whistle",
  72: "Long Whistle",
  73: "Short Guiro",
  74: "Long Guiro",
  75: "Claves",
  76: "High Wood Block",
  77: "Low Wood Block",
  78: "Mute Cuica",
  79: "Open Cuica",
  80: "Mute Triangle",
  81: "Open Triangle",
  82: "Shaker"
}
