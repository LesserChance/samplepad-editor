/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { MidiMap } from 'util/const'
import { updatePadIntProperty, updatePadSensitivity } from 'redux/actions'

/* Component imports */
import SamplePlayerComponent from 'component/SamplePlayer'
import SampleComponent from 'component/Sample'
import MidiNoteSelectComponent from 'component/Pad/MidiNoteSelect'
import KnobComponent from 'component/Pad/KnobControl'
import SlideComponent from 'component/Pad/SlideControl'
import VelocityComponent from 'component/Pad/Velocity'
import MuteGroupComponent from 'component/Pad/MuteGroup'

const PadLayerAComponent = (props) => {

  let pad = props.pad;
  let padName = MidiMap[pad.padType][0]

  return (
    <div className="">
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
              min={1}
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

            <VelocityComponent
              min={pad.velocityMin}
              max={pad.velocityMax}
              tooltip={"Velocity: " + pad.velocityMin + "-" + pad.velocityMax}
              onChangeMin={(value) => props.updatePadIntProperty('velocityMin', value)}
              onChangeMax={(value) => props.updatePadIntProperty('velocityMax', value)} />

            <MuteGroupComponent
              mgrp={pad.mgrp}
              max={pad.velocityMax}
              tooltip={"Mute Group: " + (pad.mgrp > 0 ? pad.mgrp : 'off')}
              onChange={(value) => props.updatePadIntProperty('mgrp', value)} />

            <div
              className={"layerBIcon has-tooltip-left " + ((!props.showLayerB && pad.fileNameB !== "") ? 'has-text-link' : '')}
              data-tooltip="Toggle Layer B"
              onClick={props.toggleLayerB}>
              <i className={"glyphicon glyphicon-chevron-" + (props.showLayerB ? 'up' : 'down')} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PadLayerAComponent)