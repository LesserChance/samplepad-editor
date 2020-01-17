import React from 'react';
import { connect } from 'react-redux'
import SamplePlayer from '../util/samplePlayer';
import { updatePadIntProperty, updatePadSensitivity } from '../redux/actions'

class PadComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      player: null,
      playing_sample: false
    };
  }

  render() {
    let pad = this.props.pad;

    return (
      <table className="table">
        <tbody>
          <tr>
            <td className="col-note"><input type="text" className="input is-static" defaultValue={pad.midiNote} onChange={(e) => this.props.updatePadIntProperty("midiNote", e.target.value)} /></td>
            <td className="col-file">
              <a className="sample button" onClick={(e) => this.playSample()}>
                <span className="panel-icon">
                  <i className={"glyphicon " + ((this.state.playing_sample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
                </span>
                <span className={((this.state.playing_sample) ? "has-text-primary" : "")}>
                  {pad.fileName}
                </span>
              </a>
            </td>
            <td className="col-velocity">
              <input type="text" className="input is-static" defaultValue={pad.velocityMin} onChange={(e) => this.props.updatePadIntProperty("velocityMin", e.target.value)} /> -
              <input type="text" className="input is-static" defaultValue={pad.velocityMax} onChange={(e) => this.props.updatePadIntProperty("velocityMax", e.target.value)} />
            </td>
            <td className="col-tune">
              <select className="input is-static" defaultValue={pad.tune} onChange={(e) => this.props.updatePadIntProperty('tune', e.target.value)}>
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
            <td className="col-sensitivity"><input type="text" className="input is-static" defaultValue={pad.sensitivityDisplayValue} onChange={(e) => this.props.updatePadSensitivity(e.target.value)} /></td>
            <td className="col-pan">
              <select className="input is-static" defaultValue={pad.pan} onChange={(e) => this.props.updatePadIntProperty('pan', e.target.value)}>
                <option value="-2">L2</option>
                <option value="-1">L1</option>
                <option value="0">ctr</option>
                <option value="1">R1</option>
                <option value="2">R2</option>
              </select>
            </td>
            <td className="col-reverb"><input type="text" className="input is-static" defaultValue={pad.reverb} onChange={(e) => this.props.updatePadIntProperty("reverb", e.target.value)} /></td>
            <td className="col-level"><input type="text" className="input is-static" defaultValue={pad.level} onChange={(e) => this.props.updatePadIntProperty("level", e.target.value)} /></td>
            <td className="col-mode"><input type="text" className="input is-static" defaultValue={pad.mode} onChange={(e) => this.props.updatePadIntProperty("mode", e.target.value)} /></td>
            <td className="col-mute-group"><input type="text" className="input is-static" defaultValue={pad.mgrp} onChange={(e) => this.props.updatePadIntProperty("mgrp", e.target.value)} /></td>
          </tr>
        </tbody>
      </table>
    );
  }

  playSample(file, index) {
    if (this.state.playing_sample) {
      this.state.player.stop();
      this.setState({playing_sample: false});
      return;
    }

    let player = new SamplePlayer();

    this.setState({
      player: player,
      playing_sample: true
    });

    player
      .play(this.props.sampleFilePath)
      .then(() => {
        this.setState({playing_sample: false});
      })
  }

}

const mapStateToProps = (state, ownProps) => {
  let pad = state.pads[ownProps.padId];
  return {
    pad: pad,
    sampleFilePath: state.drive.rootModelPath + "/" +  pad.fileName + ".wav"
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadIntProperty: (property, value) => {
      dispatch(updatePadIntProperty(property, value));
    },
    updatePadSensitivity: (value) => {
      dispatch(updatePadSensitivity(value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadComponent)
