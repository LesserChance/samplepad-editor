import React from 'react';
import { connect } from 'react-redux'
import { MidiMap } from '../util/const'
import SamplePlayerComponent from './SamplePlayer'
import SampleComponent from './Sample'
import MidiNoteSelectComponent from './PadControl/MidiNoteSelect'
import KnobComponent from './PadControl/Knob'
import SlideComponent from './PadControl/Slide'
import { updatePadIntProperty, updatePadSensitivity, updatePadStringProperty } from '../redux/actions'

const PadComponent = (props) => {
  let pad = props.pad;
  let padName = MidiMap[pad.padType][0]

  return (
    <div className="container">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <span className="is-size-7 has-background-grey-lighter padName">
              {padName}:
            </span>
          </div>

          <div className="level-item">
            <MidiNoteSelectComponent
              padType={pad.padType}
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
            <KnobComponent
              min={-4}
              max={4}
              tooltip={'Tune: '}
              icon={'off'}
              value={pad.tune}
              stepDistance={50}
              onChange={(value) => props.updatePadIntProperty("tune", value)}/>

            <SlideComponent
              min={0}
              max={8}
              tooltip={'Sensitivity: '}
              icon={'screenshot'}
              value={pad.sensitivity}
              stepDistance={100}
              overlayProperty='color'
              onChange={(value) => props.updatePadSensitivity(value)}/>

            <KnobComponent
              min={-4}
              max={4}
              tooltip={'Pan: '}
              icon={'upload'}
              value={pad.pan}
              stepDistance={50}
              onChange={(value) => props.updatePadIntProperty("pan", value)}/>

            <SlideComponent
              min={0}
              max={10}
              tooltip={'Reverb: '}
              icon={'signal'}
              value={pad.reverb}
              stepDistance={100}
              overlayProperty='width'
              onChange={(value) => props.updatePadIntProperty("reverb", value)}/>

            <SlideComponent
              min={0}
              max={10}
              tooltip={'Level: '}
              icon={'volume-up'}
              value={pad.level}
              stepDistance={100}
              overlayProperty='width'
              onChange={(value) => props.updatePadIntProperty("level", value)}/>

            <span className="modeIcon">
              <div className="field">
                <div className="control">
                  <div className="select is-small">
                    <select
                      value={pad.mode || ""}
                      onChange={(e) => props.updatePadIntProperty('mode', e.target.value)}>
                      <option value='0'>POLY</option>
                      <option value='1'>MONO</option>
                      <option value='2'>LOOP</option>
                      <option value='3'>STOP</option>
                      <option value='4'>TMP</option>
                      <option value='5'>CLK</option>
                      <option value='6'>HAT</option>
                    </select>
                  </div>
                </div>
              </div>
            </span>

            <span className="velocityIcon has-tooltip-bottom" data-tooltip={"Velocity: " + pad.velocityMin + "-" + pad.velocityMax}><span className="is-small">({pad.velocityMin}-{pad.velocityMax})</span></span>

            <span className={"mgrpIcon has-tooltip-left " + getMgrpForegroundClass(pad.mgrp)} style={{backgroundColor: getMgrpBackgroundColor(pad.mgrp)}} data-tooltip={"Mute Group: " + (pad.mgrp > 0 ? pad.mgrp : 'off')}>{pad.mgrp > 0 ? pad.mgrp : '-'}</span>

            <div className="dataIcon">
              { !!pad.fileNameB &&
                <i className="glyphicon glyphicon-chevron-down" aria-hidden="true" />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

const getMgrpForegroundClass = (value) => {
  if ([2,3,8,9,11,13,15,16].indexOf(value) > -1) {
    // these background colors require light text
    return 'has-text-white';
  }

  // other background colors require dark text
  return 'has-text-black';
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
      dispatch(updatePadIntProperty(ownProps.padId, property, value));
    },
    updatePadStringProperty: (property, value) => {
      dispatch(updatePadIntProperty(ownProps.padId, property, value));
    },
    updatePadSensitivity: (value) => {
      dispatch(updatePadSensitivity(ownProps.padId, value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadComponent)
