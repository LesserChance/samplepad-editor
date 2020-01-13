const uuidv1 = require('uuid/v1');

class Pad {
  static defaultState() {
    return {
      id: uuidv1()
    };
  }

  constructor(props) {
    props = Object.assign({}, Pad.defaultState(), props)

    // First Layer
    this.fileName = props.fileName;
    this.displayName = props.displayName;
    this.velocityMin = props.velocityMin;
    this.velocityMax = props.velocityMax;

    // // Second Layer
    // fileName_b: null,
    // displayName_b: null,
    // velocityMin_b: null,
    // velocityMax_b: null,

    this.reverb = props.reverb;
    this.level = props.level;
    this.midiNote = props.midiNote;
    this.mode = props.mode;
    this.mgrp = props.mgrp;

    // There properties are stored and displayed differently
    this.tune = props.tune;
    this.sensitivity = props.sensitivity;
    this.pan = props.pan;
  }

  /*
   * tune display value is -4 to +4 (unsigned int: 252,253,254,255,0,1,2,3,4)
   * @returns {String}
   */
  getTuneDisplayValue() {
    // todo: theres definitely a better way to convert uint8 to signed int here, right?
    let tune = this.tune
    if (tune >= 252) {
      return '' + (-1 * (256 - tune));
    }

    return '' + tune;
  }

  /*
   * @param {String} value
   */
  setTuneFromDisplayValue(value) {
    let tune = parseInt(value, 10);

    if (tune < 0) {
      this.tune = (256 + tune);
    } else {
      this.tune = (tune);
    }
  }

  /*
   * sensitivity is 1 to 8 (5=23, 7=27, 8=32  -- cant figure the pattern out - need to map each)
   * @returns {String}
   */
  getSensitivityDisplayValue() {
    switch (this.sensitivity) {
      case 23:
        return '5';
      case 27:
        return '7';
      case 32:
        return '8';
      default:
        return '' + this.sensitivity;
    }
  }

  /*
   * @param {String} value
   */
  setSensitivityFromDisplayValue(value) {
    switch (value) {
      case '5':
        this.sensitivity = 23;
        break;
      case '7':
        this.sensitivity = 27;
        break;
      case '8':
        this.sensitivity = 32;
        break;
      default:
        throw new Error("invalid sensitivity value");
    }
  }

  /*
   * pan display value is L4 to R4 (unsigned int: 252,253,254,255,0,1,2,3,4)
   * @returns {String}
   */
  getPanDisplayValue() {
    let pan = this.pan

    if (pan === 0) {
      return 'ctr';
    } else if (pan >= 252) {
      return "L" + (256 - pan);
    } else {
      return "R" + pan;
    }
  }

  /*
   * @param {String} value
   */
  setPanFromDisplayValue(value) {
    if (value === 'ctr') {
      this.pan = 0
    } else {
      if (value.length <= 1) {
        throw new Error("invalid pan value");
      }

      let direction = value.substring(0,1);
      let amount = parseInt(value.substring(1), 10);
      if (direction === 'L') {
        this.pan = -1 * amount;
      } else if (direction === 'R') {
        this.pan = amount;
      } else {
        throw new Error("invalid pan value");
      }
    }
  }

  /*
   * Create Pad Models given an array of json properties
   * @param {Object} pad_props
   */
  static fromArray(pad_props) {
    var pads = pad_props.map((props) => {
      return new Pad(props);
    });

    return pads.sort((a, b) => {return a.MidiNote() > b.getMidiNote()})
  }
}

export default Pad;