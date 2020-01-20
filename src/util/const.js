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
  CHECKSUM_BYTE: 0x08,

  /*
   * PAD NOTE BLOCK FORMAT
   * mem start   00 01 02 03 04 05 06 07  08 09 0a 0b 0c 0d 0e 0f  |................| bit params
   *
   * block1_start: locaion
   * 0xaaaaaaaa  4b 49 54 49 01 00 00 XX  00 00 00 00 00 00 00 07  |KITI............| 07-location
   *        +10  32 32 41 63 42 64 31 00  00 00 00 00 00 00 00 00  |22AcBd1.........|
   *
   * block2_start: parameters
   * 0xbbbbbbbb  00 00 00 18 00 09 00 00  00 XX 00 0a 01 XX 04 08  |................| 09-level, 0d-tune
   *        +10  02 XX 04 08 03 XX 00 0a  08 XX 00 7f 09 XX 00 05  |.........%......| 01-pan, 05-reverb, 09-midiNote, 0d-mode
   *        +20  0c XX 00 08 0d 00 00 09  0e XX 00 10 00 00 00 7f  |................| 01-sensitivity, 09-mgrp
   *
   * block3_start: parameters
   * 0xyyyyyyyy  00 00 00 18 00 09 00 00  00 XX 00 0a 01 XX 04 08  |................| 09-level, 0d-tune
   *        +10  02 XX 04 08 03 XX 00 0a  08 XX 00 7f 09 XX 00 05  |.........%......| 01-pan, 05-reverb, 09-midiNote, 0d-mode
   *        +20  0c XX 00 08 0d 00 00 09  0e XX 00 10 00 00 00 00  |................| 01-sensitivity, 09-mgrp
   *
   * block4_start: filenames and velocity
   * 0xzzzzzzzz  aa aa XX XX 00 00 00 XX  YY YY YY YY YY YY YY YY  |........AAAAAAAA| 02-velMin, 03-velMax, 07-filenameLength, 08-0f-displayName
   *        +10  YY YY YY YY YY YY YY YY  00 00 00 00 00 00 00 00  |aaaaaaaa........| 00-07-filename
   *        +20  aa aa XX XX 00 00 00 XX  YY YY YY YY YY YY YY YY  |........BBBBBBBB| 02-velMinB, 03-velMaxB, 07-filenameLengthB, 08-0f-displayNameB
   *        +30  YY YY YY YY YY YY YY YY  00 00 00 00 00 00 00 00  |bbbbbbbb........| 00-07-filenameB
   */

  HEADER: [0x4B,0x49,0x54,0x48,0x00,0x80,0x00,0x00],

  PAD_BLOCK_1_BASE: [
    0x4b, 0x49, 0x54, 0x49, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07,
    0x32, 0x32, 0x41, 0x63, 0x42, 0x64, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ],

  PAD_BLOCK_2_BASE: [
    0x00, 0x00, 0x00, 0x18, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x01, 0x00, 0x04, 0x08,
    0x02, 0x00, 0x04, 0x08, 0x03, 0x00, 0x00, 0x0a, 0x08, 0x00, 0x00, 0x7f, 0x09, 0x00, 0x00, 0x05,
    0x0c, 0x00, 0x00, 0x08, 0x0d, 0x00, 0x00, 0x09, 0x0e, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x7f
  ],

  PAD_BLOCK_3_BASE: [
    0x00, 0x00, 0x00, 0x18, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x01, 0x00, 0x04, 0x08,
    0x02, 0x00, 0x04, 0x08, 0x03, 0x00, 0x00, 0x0a, 0x08, 0x00, 0x00, 0x7f, 0x09, 0x00, 0x00, 0x05,
    0x0c, 0x00, 0x00, 0x08, 0x0d, 0x00, 0x00, 0x09, 0x0e, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00
  ],

  PAD_BLOCK_4_BASE: [
    0xaa, 0xaa, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xaa, 0xaa, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ],

  /* map each pad to its memory block start location: {pad: [block1_start, block2_start, block3_start, block4_start]} */
  PAD_MAP: {
    kick:   [0x0F80, 0x0FA0, 0x27A0, 0x2800],
    snr_a:  [0x0080, 0x00A0, 0x18A0, 0x1900],
    snr_b:  [0x0180, 0x01A0, 0x19A0, 0x1A00],
    tom1a:  [0x0280, 0x02A0, 0x1AA0, 0x1B00],
    tom1b:  [0x0380, 0x03A0, 0x1BA0, 0x1C00],
    tom2a:  [0x0480, 0x04A0, 0x1CA0, 0x1D00],
    tom2b:  [0x0580, 0x05A0, 0x1DA0, 0x1E00],
    tom3a:  [0x0680, 0x06A0, 0x1EA0, 0x1F00],
    tom3b:  [0x0780, 0x07A0, 0x1FA0, 0x2000],
    cr1a:   [0x0880, 0x08A0, 0x20A0, 0x2100],
    cr1b:   [0x0980, 0x09A0, 0x21A0, 0x2200],
    cr2a:   [0x0A80, 0x0AA0, 0x22A0, 0x2300],
    cr2b:   [0x0B80, 0x0BA0, 0x23A0, 0x2400],
    ridea:  [0x0C80, 0x0CA0, 0x24A0, 0x2500],
    rideb:  [0x0E80, 0x0EA0, 0x26A0, 0x2700],
    hha_op: [0x1080, 0x10A0, 0x28A0, 0x2900],
    hha_md: [0x1280, 0x12A0, 0x2AA0, 0x2B00],
    hha_cl: [0x1480, 0x14A0, 0x2CA0, 0x2D00],
    hhb_op: [0x1180, 0x11A0, 0x29A0, 0x2A00],
    hhb_md: [0x1380, 0x13A0, 0x2BA0, 0x2C00],
    hhb_cl: [0x1580, 0x15A0, 0x2DA0, 0x2E00],
    hh_chk: [0x1680, 0x16A0, 0x2EA0, 0x2F00],
    hh_spl: [0x1780, 0x17A0, 0x2FA0, 0x3000]
  },

  /* Map of each parameters memory start location in its param block */
  PAD_PARAM_START_MAP: {
    // block 1
    'location':0x07,

    // blocks 2 and 3
    'level':0x09,
    'tune':0x0d,
    'pan':0x11,
    'reverb':0x15,
    'midiNote':0x19,
    'mode':0x1d,
    'sensitivity':0x21,
    'mgrp':0x29,

    // block 4
    'velocityMin':0x02,
    'velocityMax':0x03,
    'fileNameLength':0x07,
    'displayName':0x08,
    'fileName':0x10,
    'velocityMinB':0x22,
    'velocityMaxB':0x23,
    'fileNameLengthB':0x27,
    'displayNameB':0x28,
    'fileNameB':0x30,
  },

  /*
   *Map of which params appear in which blocks
   * leaves out block 3 empty since it duplicates block 2
   * leaves out filename and displayName, since they require the length to read
   */
  PAD_PARAM_READ_BLOCKS: [
    ['location'],
    ['level','tune','pan','reverb','midiNote','mode','sensitivity','mgrp'],
    [],
    ['velocityMin','velocityMax','fileNameLength','velocityMinB','velocityMaxB','fileNameLengthB']
  ]
};

/* map pad types to the pad name and default midi note */
export const MidiMap = {
  kick:   ["Bass Drum 1", 36],
  snr_a:  ["Snare Drum 1", 38],
  snr_b:  ["Snare Drum 2", 40],
  tom1a:  ["High Tom 2",48],
  tom1b:  ["High Tom 1",50],
  tom2a:  ["Mid Tom 2",45],
  tom2b:  ["Mid Tom 1",47],
  tom3a:  ["Low Tom 1",43],
  tom3b:  ["Vibra Slap",58],
  cr1a:   ["Crash Cymbal 1",49],
  cr1b:   ["Splash Cymbal",55],
  cr2a:   ["Crash Cymbal 2",57],
  cr2b:   ["Chinese Cymbal",52],
  ridea:  ["Ride Cymbal 1",51],
  rideb:  ["Ride Bell",53],
  hha_op: ["Open Hi-hat 1",46],
  hha_md: ["Mid Hi-hat 1",23],
  hha_cl: ["Closed Hi-hat 1",42],
  hhb_op: ["Open Hi-hat 2",26],
  hhb_md: ["Mid Hi-hat 2",24],
  hhb_cl: ["Closed Hi-hat 2",22],
  hh_chk: ["Pedal Hi-hat",44],
  hh_spl: ["Spl Hi-hat 1",21],
}
