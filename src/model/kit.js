import Pad from './pad';
import KitfileParser from "../util/kitfile_parser"

class Kit {
  constructor(props) {
    this.is_new = props.is_new || false;
    this.filepath = props.filepath;
    this.filename = props.filename;
    this.kit_name = props.kit_name;
    this.pads = props.pads;
  }

  static fromArray(kit_props) {
    var kits = kit_props.map((props) => {
      // pads should reference the models
      props.pads = Pad.fromArray(props.pads);

      return new Kit(props);
    });

    return kits.sort((a, b) => {return a.kit_name > b.kit_name})
  }

  save(as_new = false) {
    KitfileParser.saveKitFile(this, as_new);
  }

  getFullFilePath() {
    return this.filepath + "/" + this.filename;
  }

  getPadWithNote(midi_note) {
    let filtered_pads = this.pads.filter((pad, index) => {
      return pad.midi_note === midi_note;
    });

    if (filtered_pads.length) {
      return filtered_pads[0];
    }

    return null;
  }
}

export default Kit;