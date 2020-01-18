import React from 'react';
import { connect } from 'react-redux'
// import SamplePlayer from '../util/samplePlayer';
import SamplePlayerComponent from './SamplePlayer'
import SampleComponent from './Sample'
import { updatePadIntProperty, updatePadSensitivity } from '../redux/actions'

const PadComponent = (props) => {
  let pad = props.pad;

  return (
    <table className="table">
      <tbody>
        <tr>
          <td className="col-note"><input type="text" className="input is-static" defaultValue={pad.midiNote} onChange={(e) => props.updatePadIntProperty("midiNote", e.target.value)} /></td>
          <td className="col-file">
            <SamplePlayerComponent sampleFile={props.padSampleFile}>
              <SampleComponent
                draggable={false}
                fileName={pad.fileName}
              />
            </SamplePlayerComponent>
          </td>
          <td className="col-velocity">
            <input type="text" className="input is-static" defaultValue={pad.velocityMin} onChange={(e) => props.updatePadIntProperty("velocityMin", e.target.value)} /> -
            <input type="text" className="input is-static" defaultValue={pad.velocityMax} onChange={(e) => props.updatePadIntProperty("velocityMax", e.target.value)} />
          </td>
          <td className="col-tune">
            <select className="input is-static" defaultValue={pad.tune} onChange={(e) => props.updatePadIntProperty('tune', e.target.value)}>
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
          <td className="col-sensitivity"><input type="text" className="input is-static" defaultValue={pad.sensitivityDisplayValue} onChange={(e) => props.updatePadSensitivity(e.target.value)} /></td>
          <td className="col-pan">
            <select className="input is-static" defaultValue={pad.pan} onChange={(e) => props.updatePadIntProperty('pan', e.target.value)}>
              <option value="-2">L2</option>
              <option value="-1">L1</option>
              <option value="0">ctr</option>
              <option value="1">R1</option>
              <option value="2">R2</option>
            </select>
          </td>
          <td className="col-reverb"><input type="text" className="input is-static" defaultValue={pad.reverb} onChange={(e) => props.updatePadIntProperty("reverb", e.target.value)} /></td>
          <td className="col-level"><input type="text" className="input is-static" defaultValue={pad.level} onChange={(e) => props.updatePadIntProperty("level", e.target.value)} /></td>
          <td className="col-mode"><input type="text" className="input is-static" defaultValue={pad.mode} onChange={(e) => props.updatePadIntProperty("mode", e.target.value)} /></td>
          <td className="col-mute-group"><input type="text" className="input is-static" defaultValue={pad.mgrp} onChange={(e) => props.updatePadIntProperty("mgrp", e.target.value)} /></td>
        </tr>
      </tbody>
    </table>
  );
}

const mapStateToProps = (state, ownProps) => {
  let pad = state.pads[ownProps.padId];
  return {
    pad: pad,
    padSampleFile: state.drive.rootPath + "/" +  pad.fileName
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
