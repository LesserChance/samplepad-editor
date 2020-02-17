export const Actions = {
  /* drive action types */
  LOAD_DRIVE: 'LOAD_DRIVE',
  RESET_SAMPLES: 'RESET_SAMPLES',

  /* kit action types */
  SORT_KITS: 'SORT_KITS',
  RESET_KITS: 'RESET_KITS',
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

  /* modal action types */
  SHOW_MODAL_CONFIRM_OVERWRITE: 'SHOW_MODAL_CONFIRM_OVERWRITE',
  HIDE_MODAL_CONFIRM_OVERWRITE: 'HIDE_MODAL_CONFIRM_OVERWRITE',
  SHOW_MODAL_CONFIRM_LOAD_CARD: 'SHOW_MODAL_CONFIRM_LOAD_CARD',
  HIDE_MODAL_CONFIRM_LOAD_CARD: 'HIDE_MODAL_CONFIRM_LOAD_CARD',

  /* notice action types */
  SHOW_NOTICE: 'SHOW_NOTICE'
};

export const PadErrors = {
  VELOCITY_SWAPPED_A: 'VELOCITY_SWAPPED_A',
  VELOCITY_TOO_HIGH_A: 'VELOCITY_TOO_HIGH_A',
  VELOCITY_SWAPPED_B: 'VELOCITY_SWAPPED_B',
  VELOCITY_TOO_HIGH_B: 'VELOCITY_TOO_HIGH_B',
  DUPLICATE_MIDI_NOTE: 'DUPLICATE_MIDI_NOTE',
};

export const PadErrorStrings = {
  VELOCITY_SWAPPED_A: 'Velocity must be in order (min-max)',
  VELOCITY_TOO_HIGH_A: 'Velocity values must be 127 or lower',
  VELOCITY_SWAPPED_B: 'Velocity must be in order (min-max)',
  VELOCITY_TOO_HIGH_B: 'Velocity values must be 127 or lower',
  DUPLICATE_MIDI_NOTE: 'Midi Note must be unique'
};

export const KitErrors = {
  INVALID_KIT_NAME: 'INVALID_KIT_NAME',
};

export const KitErrorStrings = {
  INVALID_KIT_NAME: 'Kit name contains invalid characters (A-Z, a-z, 0-9 only)',
};

export const DragItemTypes = {
  SAMPLE: 'sample'
};

export const Drive = {
  DEVICE_ID_FILE: ".sampleeditordevice",
  SAMPLE_FILE_TYPE: "wav",
  SAMPLE_EXTENSION: ".wav",
  KIT_EXTENSION: ".KIT",
  KIT_FILE_TYPE: "KIT",
  KIT_DIRECTORY: "KITS",
  MAX_SAMPLES: 512
};

export const KitBuffer = {
  CHECKSUM_BYTE: 0x08,

  // pads are written to the kit file in this order
  PAD_FILE_ORDER: [
    'snr_a', 'snr_b', 'tom1a', 'tom1b', 'tom2a', 'tom2b', 'tom3a', 'tom3b', 'cr1a', 'cr1b', 'cr2a', 'cr2b', 'ridea',
    'ride2', 'rideb', 'kick', 'hha_op', 'hhb_op', 'hha_md', 'hhb_md', 'hha_cl', 'hhb_cl', 'hh_chk', 'hh_spl'
  ],

  /* Map of each pad to its memory block start location: {pad: [block1_start, block2_start, block1_type]} */
  PAD_MEMORY_BLOCK_LOCATIONS: {
    kick:   [0x0F80, 0x2780],
    snr_a:  [0x0080, 0x1880],
    snr_b:  [0x0180, 0x1980],
    tom1a:  [0x0280, 0x1A80],
    tom1b:  [0x0380, 0x1B80],
    tom2a:  [0x0480, 0x1C80],
    tom2b:  [0x0580, 0x1D80],
    tom3a:  [0x0680, 0x1E80],
    tom3b:  [0x0780, 0x1F80],
    cr1a:   [0x0880, 0x2080],
    cr1b:   [0x0980, 0x2180],
    cr2a:   [0x0A80, 0x2280],
    cr2b:   [0x0B80, 0x2380],
    ridea:  [0x0C80, 0x2480],
    ride2:  [0x0D80, 0x2580],
    rideb:  [0x0E80, 0x2680],
    hha_op: [0x1080, 0x2880],
    hha_md: [0x1280, 0x2A80],
    hha_cl: [0x1480, 0x2C80],
    hhb_op: [0x1180, 0x2980],
    hhb_md: [0x1380, 0x2B80],
    hhb_cl: [0x1580, 0x2D80],
    hh_chk: [0x1680, 0x2E80],
    hh_spl: [0x1780, 0x2F80]
  },

  /* Map of each parameters memory start location in its param block */
  PAD_PARAM_MEMORY_LOCATION: [
    {
      'location':   0x07,
      'level':      0x29,
      'tune':       0x2d,
      'pan':        0x31,
      'reverb':     0x35,
      'midiNote':   0x39,
      'mode':       0x3d,
      'sensitivity':0x41,
      'mgrp':       0x49
    },
    {
      'level':          0x29,
      'tune':           0x2d,
      'pan':            0x31,
      'reverb':         0x35,
      'midiNote':       0x39,
      'mode':           0x3d,
      'sensitivity':    0x41,
      'mgrp':           0x49,
      'velocityMin':    0x82,
      'velocityMax':    0x83,
      'fileNameLength': 0x87,
      'fileName':       0x90,
      'velocityMinB':   0xa2,
      'velocityMaxB':   0xa3,
      'fileNameLengthB':0xa7,
      'fileNameB':      0xb0,
    }
  ],

  /*
   * Map of which params to read from which blocks
   * leaves out filenames, since they require the length to read
   */
  PAD_PARAM_READ_BLOCKS: [
    ['location','level','tune','pan','reverb','midiNote','mode','sensitivity','mgrp'],
    ['velocityMin','velocityMax','fileNameLength','velocityMinB','velocityMaxB','fileNameLengthB']
  ]
};

/*
 * Map pad types to the pad name and default midi note
 * This is also used to determine the order we want to display the pads
 */
export const MidiMap = {
  kick:   ["Bass Drum 1", 36],
  snr_a:  ["Snare Drum 1", 38],
  snr_b:  ["Snare Drum 2", 40],
  tom1a:  ["High Tom 2",48],
  tom1b:  ["High Tom 1",50],
  tom2a:  ["Mid Tom 2",45],
  tom2b:  ["Mid Tom 1",47],
  tom3a:  ["Low Tom 1",43],
  tom3b:  ["Low Tom 2",58],
  cr1a:   ["Crash Cymbal 1",49],
  cr1b:   ["Splash Cymbal",55],
  cr2a:   ["Crash Cymbal 2",57],
  cr2b:   ["Chinese Cymbal",52],
  ridea:  ["Ride Cymbal 1",51],
  rideb:  ["Ride Bell",53],
  ride2:  ["Ride Cymbal 2",59],
  hha_op: ["Open Hi-hat 1",46],
  hha_md: ["Mid Hi-hat 1",23],
  hha_cl: ["Closed Hi-hat 1",42],
  hhb_op: ["Open Hi-hat 2",26],
  hhb_md: ["Mid Hi-hat 2",24],
  hhb_cl: ["Closed Hi-hat 2",22],
  hh_chk: ["Pedal Hi-hat",44],
  hh_spl: ["Spl Hi-hat 1",21],
}
