import React from 'react';
import { connect } from 'react-redux'
import SamplePlayerComponent from './SamplePlayer'
import SampleComponent from './Sample'
import MidiNoteSelectComponent from './MidiNoteSelect'
import { updatePadIntProperty, updatePadSensitivity } from '../redux/actions'

const PadComponent = (props) => {
  let pad = props.pad;
  let mgrp = Math.floor((Math.random() * 17));
  let reverb = Math.floor((Math.random() * 11));
  let pan = Math.floor((Math.random() * 9) - 4);
  let tune = Math.floor((Math.random() * 9) - 4);
  let level = Math.floor((Math.random() * 11));
  let mode = Math.floor((Math.random() * 7));
  let sensitivity = Math.floor((Math.random() * 9));

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <MidiNoteSelectComponent
              value={pad.midiNote}
              onChange={(midiNote) => props.updatePadIntProperty("midiNote", midiNote)} />
          </div>
          <div className="level-item">
            <SamplePlayerComponent sampleFile={props.padSampleFile}>
              <SampleComponent
                draggable={false}
                fileName={pad.fileName}
              />
            </SamplePlayerComponent>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <span className="dataIcon has-tooltip-bottom" data-tooltip={"Tune: " + tune}><i className="glyphicon glyphicon-off" aria-hidden="true" style={{transform: getRotateTransform(tune)}} /></span>

            <span className="dataIcon has-tooltip-bottom" data-tooltip={"Sensitivity: " + sensitivity}><i className="glyphicon glyphicon-screenshot" aria-hidden="true" style={{color: getSensitivityForground(sensitivity)}}/></span>

            <span className="dataIcon has-tooltip-bottom" data-tooltip={"Pan: " + pan}><i className="glyphicon glyphicon-upload" aria-hidden="true" style={{transform: getRotateTransform(pan)}}/></span>

            <span className="overlapIcon has-tooltip-bottom" data-tooltip={"Reverb: " + reverb}>
              <div className="overlapContainer">
                <div><i className="glyphicon glyphicon-signal has-text-grey-lighter" aria-hidden="true" /></div>
                <div><i className="glyphicon glyphicon-signal overlapValue" style={{width: getOverlapWidth(reverb, 10)}} aria-hidden="true" /></div>
              </div>
            </span>

            <span className="overlapIcon has-tooltip-bottom" data-tooltip={"Level: " + level}>
              <div className="overlapContainer">
                <div><i className="glyphicon glyphicon-volume-up has-text-grey-lighter" aria-hidden="true" /></div>
                <div><i className="glyphicon glyphicon-volume-up overlapValue" style={{width: getOverlapWidth(level, 10)}} aria-hidden="true" /></div>
              </div>
            </span>

            <span className="modeIcon has-tooltip-bottom" data-tooltip={"Mode: " + getMode(mode)}><span className="is-small">{getMode(mode)}</span></span>

            <span className="velocityIcon has-tooltip-bottom" data-tooltip={"Velocity: " + pad.velocityMin + "-" + pad.velocityMax}><span className="is-small">({pad.velocityMin}-{pad.velocityMax})</span></span>

            <span className="mgrpIcon has-tooltip-left" style={{color: getMgrpForegroundColor(mgrp),backgroundColor: getMgrpBackgroundColor(mgrp)}} data-tooltip={"Mute Group: " + (mgrp > 0 ? mgrp : 'off')}>{mgrp > 0 ? mgrp : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const getRotateTransform = (value) => {
  // -4 to 4 => -90 to 90
  let rotate = 'rotate(' + (22.5 * value) + 'deg)';
  let translate = 'translate(0, ' + Math.abs(.025 * value) + 'em)';
  return rotate + ' ' + translate ;
}

const getSensitivityForground = (value) => {
  let color = (240 - (value * 30)).toString(16);
  return '#' + color + color + color;
}

const getOverlapWidth = (value, max) => {
  // 0 to 10, 0 to ~1.2
  return (value * (1.2/max)) + 'em';
}

const getMode = (value) => {
  return ['POLY','MONO','LOOP','STOP','TMP','CLK','HAT'][value];
}

const getMgrpBackgroundColor = (value) => {
  // 0 to 16
  return [
    '#ffffff',
    '#73dc32','#d12394','#2394d1','#ffb3b3',
    '#79ff57','#dd57ff','#ffdd57','#d16023',
    '#5779ff','#00d1b2','#d1001f','#d1b200',
    '#3273dc','#dc9b32','#9b32dc','#001fd1'
  ][value];
}

const getMgrpForegroundColor = (value) => {
  if (value == 2 || value == 3 || value == 8 || value == 9 || value == 11 || value == 13 || value == 15 || value == 16) {
    return '#ffffff';
  }

  return 'rgba(0, 0, 0, 0.7)';
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
