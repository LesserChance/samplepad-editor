import React from 'react';
import '../css/Pad.css';

class PadComponent extends React.Component {

  constructor(props) {
    super(props);

    this.updatePadIntProperty = this.updatePadIntProperty.bind(this);
    this.updatePadStringProperty = this.updatePadStringProperty.bind(this);
    this.updatePadSensitivity = this.updatePadSensitivity.bind(this);
  }

  render() {
    let pad = this.props.pad;

    return (
      <tr>
        <th scope="row"><input type="text" className="form-control" defaultValue={pad.midiNote} onChange={(e) => this.updatePadIntProperty("midiNote", e.target.value)} /></th>
        <td><input type="text" className="form-control" defaultValue={pad.fileName} onChange={(e) => this.updatePadStringProperty("fileName", e.target.value)} /></td>
        <td><input type="text" className="form-control" defaultValue={pad.displayName} onChange={(e) => this.updatePadStringProperty("displayName", e.target.value)} /></td>
        <td className="velocity-td">
          <input type="text" className="form-control" defaultValue={pad.velocityMin} onChange={(e) => this.updatePadIntProperty("velocityMin", e.target.value)} /> -
          <input type="text" className="form-control" defaultValue={pad.velocityMax} onChange={(e) => this.updatePadIntProperty("velocityMax", e.target.value)} />
        </td>
        <td>
          <select className="form-control" defaultValue={pad.tune} onChange={(e) => this.updatePadIntProperty('tune', e.target.value)}>
            <option value="252">-4</option>
            <option value="253">-3</option>
            <option value="254">-2</option>
            <option value="255">-1</option>
            <option value="0">0</option>
            <option value="1">+1</option>
            <option value="2">+2</option>
            <option value="3">+3</option>
            <option value="4">+4</option>
          </select>
        </td>
        <td><input type="text" className="form-control" defaultValue={pad.sensitivityDisplayValue} onChange={(e) => this.updatePadSensitivity(e.target.value)} /></td>
        <td>
          <select className="form-control" defaultValue={pad.pan} onChange={(e) => this.updatePadIntProperty('pan', e.target.value)}>
            <option value="-2">L2</option>
            <option value="-1">L1</option>
            <option value="0">ctr</option>
            <option value="1">R1</option>
            <option value="2">R2</option>
          </select>
        </td>
        <td><input type="text" className="form-control" defaultValue={pad.reverb} onChange={(e) => this.updatePadIntProperty("reverb", e.target.value)} /></td>
        <td><input type="text" className="form-control" defaultValue={pad.level} onChange={(e) => this.updatePadIntProperty("level", e.target.value)} /></td>
        <td><input type="text" className="form-control" defaultValue={pad.mode} onChange={(e) => this.updatePadIntProperty("mode", e.target.value)} /></td>
        <td><input type="text" className="form-control" defaultValue={pad.mgrp} onChange={(e) => this.updatePadIntProperty("mgrp", e.target.value)} /></td>
      </tr>
    );
  }

  updatePadIntProperty(property, value) {
    this.updatePadProperty(property, parseInt(value, 10));
  }

  updatePadStringProperty(property, value) {
    this.updatePadProperty(property, value);
  }

  updatePadSensitivity(value) {
    this.props.pad.setSensitivityFromDisplayValue(value);
  }

  updatePadProperty(property, value) {
    this.props.pad[property] = value;
  }

}

export default PadComponent;
