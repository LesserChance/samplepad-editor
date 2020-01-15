import React from 'react';
import '../css/Pad.css';
import samplePlayer from '../util/sample_player';

class PadComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      player: null,
      playing_sample: false
    };

    this.updatePadIntProperty = this.updatePadIntProperty.bind(this);
    this.updatePadStringProperty = this.updatePadStringProperty.bind(this);
    this.updatePadSensitivity = this.updatePadSensitivity.bind(this);
  }

  render() {
    let pad = this.props.pad;

    return (
      <tr>
        <th scope="row"><input type="text" className="input" defaultValue={pad.midiNote} onChange={(e) => this.updatePadIntProperty("midiNote", e.target.value)} /></th>
        <td>
          <a className="sample button" onClick={(e) => this.playSample()}>
            <span className="panel-icon">
              <i className={"glyphicon " + ((this.state.playing_sample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
            </span>
            <span className={((this.state.playing_sample) ? "has-text-primary" : "")}>
              {pad.fileName}
            </span>
          </a>
        </td>
        <td className="velocity-td">
          <input type="text" className="input" defaultValue={pad.velocityMin} onChange={(e) => this.updatePadIntProperty("velocityMin", e.target.value)} /> -
          <input type="text" className="input" defaultValue={pad.velocityMax} onChange={(e) => this.updatePadIntProperty("velocityMax", e.target.value)} />
        </td>
        <td>
          <select className="input" defaultValue={pad.tune} onChange={(e) => this.updatePadIntProperty('tune', e.target.value)}>
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
        <td><input type="text" className="input" defaultValue={pad.sensitivityDisplayValue} onChange={(e) => this.updatePadSensitivity(e.target.value)} /></td>
        <td>
          <select className="input" defaultValue={pad.pan} onChange={(e) => this.updatePadIntProperty('pan', e.target.value)}>
            <option value="-2">L2</option>
            <option value="-1">L1</option>
            <option value="0">ctr</option>
            <option value="1">R1</option>
            <option value="2">R2</option>
          </select>
        </td>
        <td><input type="text" className="input" defaultValue={pad.reverb} onChange={(e) => this.updatePadIntProperty("reverb", e.target.value)} /></td>
        <td><input type="text" className="input" defaultValue={pad.level} onChange={(e) => this.updatePadIntProperty("level", e.target.value)} /></td>
        <td><input type="text" className="input" defaultValue={pad.mode} onChange={(e) => this.updatePadIntProperty("mode", e.target.value)} /></td>
        <td><input type="text" className="input" defaultValue={pad.mgrp} onChange={(e) => this.updatePadIntProperty("mgrp", e.target.value)} /></td>
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

  playSample(file, index) {
    if (this.state.playing_sample) {
      this.state.player.stop();
      this.setState({playing_sample: false});
      return;
    }

    this.state.player = new samplePlayer();
    this.setState({playing_sample: true});
    this.state.player
      .play(this.props.sampleDrive.getSampleFilePath(this.props.pad.fileName + ".wav"))
      .then(() => {
        this.setState({playing_sample: false});
      })
  }

}

export default PadComponent;
