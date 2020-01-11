import Pad from './pad';

class Kit {
  constructor(props) {
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
}

export default Kit;