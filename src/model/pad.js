class Pad {
  constructor(props) {
    // First Layer
    this.filename = props.filename;
    this.display_name = props.display_name;
    this.velocity_min = props.velocity_min;
    this.velocity_max = props.velocity_max;

    // Second Layer
    this.filename_b = props.filename_b;
    this.display_name_b = props.display_name_b;
    this.velocity_min_b = props.velocity_min_b;
    this.velocity_max_b = props.velocity_max_b;

    // Universal
    this.tune = props.tune;
    this.sensitivity = props.sensitivity;
    this.pan = props.pan;
    this.reverb = props.reverb;
    this.level = props.level;
    this.midi_note = props.midi_note;
    this.mode = props.mode;
    this.mgrp = props.mgrp;
  }

  static fromArray(pad_props) {
    var pads = pad_props.map((props) => {
      return new Pad(props);
    });

    return pads.sort((a, b) => {return a.display_name > b.display_name})
  }

  // Getters + setters
  // tune display value is -4 to +4 (252,253,254,255,0,1,2,3,4)
  get tune_display() {
    if (this.tune >= 252) {
      return -1 * (256 - this.tune);
    }

    return '' + this.tune;
  }
  set tune_display(value) {
    let tune = parseInt(value, 10);

    if (tune < 0) {
      this.tune = (256 - tune);
    } else {
      this.tune = tune;
    }
  }

  // sensitivity is 1 to 8
  get sensitivity_display() {
    return '' + this.sensitivity;
  }
  set sensitivity_display(value) {
    this.sensitivity = value;
  }

  // pan display value is L4 to R4 (252,253,254,255,0,1,2,3,4)
  get pan_display() {
    if (this.pan === 0) {
      return 'ctr';
    } else if (this.pan >= 252) {
      return "L" + (256 - this.pan);
    } else {
      return "R" + this.pan;
    }
  }
  set pan_display(value) {
    if (value === 'ctr') {
      this.pan = 0;
    } else {
      let direction = value.substring(0,1);
      let amount = parseInt(value.substring(1), 10);
      if (direction === 'L') {
        this.pan = -1 * amount;
      } else if (direction === 'R') {
        this.pan = amount;
      }
    }
  }
}

export default Pad;