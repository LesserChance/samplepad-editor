/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { PadErrors, PadErrorStrings } from 'const'
import { updatePadIntProperty, updatePadProperty } from 'actions/pad'

/* Component imports */
import SamplePlayerComponent from 'component/SamplePlayer'
import SampleComponent from 'component/Sample'
import PadNameComponent from 'component/Pad/PadName'
import VelocityComponent from 'component/Pad/Velocity'

const PadLayerBComponent = (props) => {
  let pad = props.pad;
  let midiProps = {
    note: pad.midiNote,
    min: pad.velocityMinB,
    max: pad.velocityMaxB
  }

  return (
    <div className="level PadLayer layerB">
      <div className="level-left">
        <PadNameComponent
            padName={"Layer B"}
            padClass={"has-background-white-ter"}
            midi={midiProps} />

        <div className="level-item Sample">
          <SamplePlayerComponent
            sampleFile={props.sampleFile}
            midi={midiProps}>
            <SampleComponent
              draggable={false}
              removable={true}
              useTooltip={true}
              fileName={pad.fileNameB}
              removeSample={() => {props.removePadSample(null)}}
            />
          </SamplePlayerComponent>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item">
          <VelocityComponent
            min={pad.velocityMinB}
            max={pad.velocityMaxB}
            tooltip={props.velocityTooltip}
            hasError={props.hasVelocityError}
            onChangeMin={(value) => props.updatePadIntProperty('velocityMinB', value)}
            onChangeMax={(value) => props.updatePadIntProperty('velocityMaxB', value)} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  let pad = state.pads[ownProps.padId];
  let velocityTooltip = "Velocity: " + pad.velocityMinB + "-" + pad.velocityMaxB;

  let hasVelocityError = false;
  if (pad.errors.indexOf(PadErrors.VELOCITY_SWAPPED_B) > -1) {
    hasVelocityError = true;
    velocityTooltip = "Error: " + PadErrorStrings.VELOCITY_SWAPPED_B;
  } else if (pad.errors.indexOf(PadErrors.VELOCITY_TOO_HIGH_B) > -1) {
    hasVelocityError = true;
    velocityTooltip = "Error: " + PadErrorStrings.VELOCITY_TOO_HIGH_B;
  }

  return {
    pad: pad,
    sampleFile: pad.fileNameB,
    hasVelocityError: hasVelocityError,
    velocityTooltip: velocityTooltip
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadIntProperty: (property, value) => {
      dispatch(updatePadIntProperty(ownProps.padId, property, value));
    },
    removePadSample: (value) => {
      dispatch(updatePadProperty(ownProps.padId, 'fileNameB', null));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadLayerBComponent)
